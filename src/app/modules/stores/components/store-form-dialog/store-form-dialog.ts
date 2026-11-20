import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';

import { apiAssetUrl } from '../../../../core/api/asset-url';
import {
  STORE_ADDRESS_MAX_LENGTH,
  STORE_CODE_MAX_LENGTH,
  STORE_NAME_MAX_LENGTH,
  STORE_PHOTO_TYPES,
  SaveStoreInput,
  Store,
  storePhotoProblem,
} from '../../models/store.model';

/** Required, ignoring spaces at either end (the server trims too). */
function requiredText(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim() ? null : { required: true };
}

/** Create or edit a store. The parent owns saving; this dialog owns the form and the picked photo. */
@Component({
  selector: 'app-store-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, MessageModule, TextareaModule],
  templateUrl: './store-form-dialog.html',
})
export class StoreFormDialog {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly open = input.required<boolean>();
  /** The store being edited, or null to create one. */
  readonly store = input<Store | null>(null);
  readonly submitting = input(false);
  readonly serverError = input<string | null>(null);

  readonly save = output<SaveStoreInput>();
  readonly cancelled = output<void>();

  protected readonly codeMaxLength = STORE_CODE_MAX_LENGTH;
  protected readonly nameMaxLength = STORE_NAME_MAX_LENGTH;
  protected readonly addressMaxLength = STORE_ADDRESS_MAX_LENGTH;
  protected readonly photoAccept = STORE_PHOTO_TYPES.join(',');

  protected readonly form = this.fb.group({
    code: this.fb.control('', { validators: [requiredText, Validators.maxLength(STORE_CODE_MAX_LENGTH)] }),
    name: this.fb.control('', { validators: [requiredText, Validators.maxLength(STORE_NAME_MAX_LENGTH)] }),
    address: this.fb.control('', { validators: [Validators.maxLength(STORE_ADDRESS_MAX_LENGTH)] }),
  });

  private readonly submitted = signal(false);
  /** A newly picked file and its object URL for the preview. */
  private readonly pickedPhoto = signal<File | null>(null);
  private readonly pickedPhotoUrl = signal<string | null>(null);
  /** The user asked to drop the store's current photo. */
  private readonly removeCurrentPhoto = signal(false);
  protected readonly photoError = signal<string | null>(null);

  protected readonly isEdit = computed(() => this.store() !== null);
  protected readonly title = computed(() => (this.isEdit() ? 'Edit store' : 'New store'));
  protected readonly submitLabel = computed(() => (this.isEdit() ? 'Save changes' : 'Add store'));
  protected readonly previewUrl = computed(
    () => this.pickedPhotoUrl() ?? (this.removeCurrentPhoto() ? null : apiAssetUrl(this.store()?.photoUrl)),
  );
  protected readonly hasPhoto = computed(() => this.previewUrl() !== null);

  constructor() {
    // Reset to the target store each time the dialog opens. untracked: picking a photo must not re-run this.
    effect(() => {
      if (this.open()) {
        const store = this.store();
        untracked(() => this.reset(store));
      }
    });

    inject(DestroyRef).onDestroy(() => this.setPickedPhoto(null));
  }

  protected fieldInvalid(name: 'code' | 'name' | 'address'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted());
  }

  protected fieldError(name: 'code' | 'name' | 'address'): string {
    const errors = this.form.controls[name].errors;
    const label = { code: 'Store code', name: 'Store name', address: 'Address' }[name];
    if (errors?.['maxlength']) {
      return `${label} must be ${errors['maxlength'].requiredLength} characters or fewer.`;
    }
    return `${label} is required.`;
  }

  protected onPhotoPicked(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0] ?? null;
    // Clear the input so picking the same file again still fires a change.
    fileInput.value = '';
    if (!file) {
      return;
    }

    const problem = storePhotoProblem(file);
    this.photoError.set(problem);
    if (problem) {
      return;
    }
    this.setPickedPhoto(file);
    this.removeCurrentPhoto.set(false);
  }

  protected removePhoto(): void {
    this.setPickedPhoto(null);
    this.photoError.set(null);
    this.removeCurrentPhoto.set(!!this.store()?.photoUrl);
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.save.emit({
      code: value.code.trim(),
      name: value.name.trim(),
      address: value.address.trim(),
      photo: this.pickedPhoto(),
      removePhoto: this.removeCurrentPhoto(),
    });
  }

  protected cancel(): void {
    this.cancelled.emit();
  }

  protected onVisibleChange(visible: boolean): void {
    if (!visible) {
      this.cancelled.emit();
    }
  }

  private reset(store: Store | null): void {
    this.submitted.set(false);
    this.photoError.set(null);
    this.removeCurrentPhoto.set(false);
    this.setPickedPhoto(null);
    this.form.reset({ code: store?.code ?? '', name: store?.name ?? '', address: store?.address ?? '' });
  }

  private setPickedPhoto(file: File | null): void {
    const previousUrl = this.pickedPhotoUrl();
    if (previousUrl) {
      URL.revokeObjectURL(previousUrl);
    }
    this.pickedPhoto.set(file);
    this.pickedPhotoUrl.set(file ? URL.createObjectURL(file) : null);
  }
}
