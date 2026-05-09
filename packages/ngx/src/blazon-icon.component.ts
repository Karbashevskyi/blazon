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
 * `<blazon-icon>` — displays a heraldic coat of arms by registry ID.
 *
 * The component lazily loads the country registry on first render if needed,
 * then inlines the sanitized SVG. Falls back to the configured fallback SVG
 * (or nothing) when the entry is not found.
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
    } @else if (isLoading()) {
      <span class="blazon-icon__loading" aria-hidden="true"></span>
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

      .blazon-icon__loading {
        display: inline-block;
        width: var(--blazon-size, 1em);
        height: var(--blazon-size, 1em);
        background: currentColor;
        opacity: 0.15;
        border-radius: 2px;
      }
    `,
  ],
})
export class BlazonIcon implements OnInit, OnChanges {
  /**
   * The unique coat of arms identifier, e.g. `"pl-city-warszawa"`.
   * Required. Changing this input triggers a new registry lookup.
   */
  @Input({ required: true }) id!: string;

  /**
   * Accessible label for the icon image (maps to `aria-label`).
   * Defaults to the coat's `name` from the registry.
   */
  @Input() alt?: string;

  /**
   * Pixel size to apply as both `width` and `height` on the SVG container.
   * If omitted, the SVG will scale to fill the host element.
   */
  @Input() size?: number;

  readonly svgContent = signal<string | null>(null);
  readonly isLoading = signal(false);

  private readonly _service = inject(BlazonIconsService);
  private readonly _sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    void this._load(this.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Skip the initial change — ngOnInit handles that
    if (!changes.id.isFirstChange()) {
      void this._load(this.id);
    }
  }

  private async _load(id: string): Promise<void> {
    this.isLoading.set(true);
    this.svgContent.set(null);

    try {
      const coat = await this._service.resolve(id);
      const raw = coat?.svg ?? this._service.fallbackSvg;

      if (raw !== null) {
        const safe = this._sanitizer.sanitize(SecurityContext.HTML, raw);
        this.svgContent.set(safe);
        if (this.alt === undefined && coat !== undefined) {
          this.alt = coat.name;
        }
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}
