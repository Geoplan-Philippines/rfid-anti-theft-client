import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { KnownEpc, SaveEpcInput, groupEpc, normalizeEpc } from '../../models/tag-registry.model';

function epcValidator(control: AbstractControl): ValidationErrors | null {
  const normalized = normalizeEpc(control.value ?? '');
  if (!normalized) {
    return { required: true };
  }
  if (!/^[0-9A-F]+$/.test(normalized)) {
    return { hex: true };
  }
  return null;
}

@Component({
  selector: 'app-tag-registry-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './tag-registry-form-dialog.html',
  styleUrl: './tag-registry-form-dialog.css',
})
export class TagRegistryFormDialog {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly open = input.required<boolean>();
  readonly mode = input.required<'create' | 'edit'>();
  readonly tag = input<KnownEpc | null>(null);
  readonly submitting = input<boolean>(false);
  readonly serverError = input<string | null>(null);

  readonly save = output<SaveEpcInput>();
  readonly cancelled = output<void>();

  protected readonly form = this.fb.group({
    epc: this.fb.control('', { validators: [epcValidator] }),
    label: this.fb.control('', { validators: [Validators.maxLength(120)] }),
  });

  private readonly submitted = signal(false);
  private readonly epcValue = toSignal(this.form.controls.epc.valueChanges, { initialValue: '' });

  protected readonly preview = computed(() => {
    const normalized = normalizeEpc(this.epcValue());
    return normalized && /^[0-9A-F]+$/.test(normalized) ? groupEpc(normalized) : '';
  });
  protected readonly title = computed(() =>
    this.mode() === 'create' ? 'Add watched tag' : 'Edit tag',
  );
  protected readonly submitLabel = computed(() =>
    this.mode() === 'create' ? 'Add tag' : 'Save changes',
  );

  constructor() {
    // Reset the form to the editing target each time the dialog opens.
    effect(() => {
      if (this.open()) {
        const tag = this.tag();
        this.submitted.set(false);
        this.form.reset({ epc: tag?.epc ?? '', label: tag?.label ?? '' });
      }
    });
  }

  protected epcInvalid(): boolean {
    const control = this.form.controls.epc;
    return control.invalid && (control.touched || this.submitted());
  }

  protected epcErrorText(): string {
    const errors = this.form.controls.epc.errors;
    if (errors?.['hex']) {
      return 'Use hexadecimal characters only (0-9, A-F).';
    }
    return 'EPC is required.';
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.save.emit({ epc: normalizeEpc(value.epc), label: value.label.trim() || null });
  }

  protected cancel(): void {
    this.cancelled.emit();
  }

  protected onVisibleChange(visible: boolean): void {
    if (!visible) {
      this.cancelled.emit();
    }
  }
}
