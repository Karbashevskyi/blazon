import {
  Component,
  Input,
  type OnChanges,
  type OnInit,
  signal,
  inject,
  ChangeDetectionStrategy,
  SecurityContext,
  type SimpleChanges,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BlazonIconsService } from './blazon-icons.service.js';

/**
 * `<blazon-icon>` — displays a heraldic locality icon by registry ID.
 *
 * Resolves the locality synchronously from the registered entries and inlines
 * the sanitized SVG. Falls back to the configured fallback SVG (or nothing)
 * when the entry is not registered.
 *
 * @example
 * ```html
 * <blazon-icon id="pl-city-warszawa" />
 * <blazon-icon id="pl-city-warszawa" [size]="64" alt="Warsaw coat of arms" />
 * ```
 *
 * Styling: the host element is `display: inline-block`. Control dimensions
 * via `--blazon-size` CSS custom property or the `size` input.
 */
@Component({
  selector: 'blazon-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (svgContent() !== null) {
      <span
        class="blazon-icon__svg"
        role="img"
        [attr.aria-label]="alt || null"
        [style.width.px]="size || null"
        [style.height.px]="size || null"
        [innerHTML]="svgContent()"
      ></span>
    }
  `,
  styles: [
    `
      :host {
        display: inline-block;
        line-height: 0;
        width: var(--blazon-size, auto);
        height: var(--blazon-size, auto);
      }

      .blazon-icon__svg {
        display: inline-flex;
      }

      .blazon-icon__svg ::ng-deep svg {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class BlazonIcon implements OnInit, OnChanges {
  /**
   * The unique locality identifier, e.g. `"pl-city-warszawa"`.
   * Required. Changing this input triggers a new registry lookup.
   */
  @Input({ required: true }) id!: string;

  /**
   * Accessible label for the icon image (maps to `aria-label`).
   * Defaults to the locality `name` from the registry.
   */
  @Input() alt?: string;

  /**
   * Pixel size to apply as both `width` and `height` on the SVG container.
   * If omitted, the SVG will scale to fill the host element.
   */
  @Input() size?: number;

  readonly svgContent = signal<string | null>(null);

  private readonly _service = inject(BlazonIconsService);
  private readonly _sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    this._resolve(this.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.id.isFirstChange()) {
      this._resolve(this.id);
    }
  }

  private _resolve(id: string): void {
    const locality = this._service.getById(id);
    const armsAsset = locality?.assets.find((a) => a.kind === 'arms');
    const raw = armsAsset?.svg ?? this._service.fallbackSvg;

    if (raw != null) {
      const safe = this._sanitizer.sanitize(SecurityContext.HTML, raw);
      this.svgContent.set(safe);
      if (this.alt === undefined && locality !== undefined) {
        this.alt = locality.name;
      }
    } else {
      this.svgContent.set(null);
    }
  }
}
