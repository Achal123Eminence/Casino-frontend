import { Directive, ElementRef, HostListener, Input } from "@angular/core";

import { regexValidation } from "../../../environments/constant";

@Directive({
  selector: "[appValidation]",
})
export class ValidationDirective {
  @Input("appValidation") pattern!: any;
  private regex!: RegExp;

  /**
   * constructor function.
   * @param {*} el - Parameter.
   * @returns {*} Result.
   */
  constructor(private el: ElementRef) {}

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit() {
    this.regex =
      typeof regexValidation[this.pattern].regex == "string"
        ? new RegExp(regexValidation[this.pattern].regex)
        : regexValidation[this.pattern].regex;
  }

  @HostListener("keydown", ["$event"])
  /**
   * onKeyDown function.
   * @param {*} event - Parameter.
   * @returns {*} Result.
   */
  onKeyDown(event: KeyboardEvent) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const currentInputValue = inputElement.value;
    const key = event.key;
    const selectionStart = inputElement.selectionStart;
    const selectionEnd = inputElement.selectionEnd;
    const specialKeys = [
      "Backspace",
      "Tab",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Delete",
      "Home",
      "End",
    ];

    if (specialKeys.includes(key)) return;
    if ((event.ctrlKey || event.metaKey) && key === "v") return;

    let nextValue = "";
    if (selectionStart !== null && selectionEnd !== null) {
      nextValue =
        currentInputValue.substring(0, selectionStart) +
        key +
        currentInputValue.substring(selectionEnd);
    } else {
      nextValue = currentInputValue + key;
    }

    if (!this.regex.test(nextValue)) {
      event.preventDefault();
    }
  }

  // ✅ Now we don't block paste, we clean invalid characters after paste
  @HostListener("paste", ["$event"])
  /**
   * onPaste function.
   * @param {*} event - Parameter.
   * @returns {*} Result.
   */
  onPaste(event: ClipboardEvent) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const pastedText = event.clipboardData?.getData("text") || "";
    
    // Temporarily allow paste
    setTimeout(() => {
      const currentValue = inputElement.value;
      // Remove all characters that don’t match regex
      const validValue = currentValue
        .split("")
        .filter((ch) => this.regex.test(ch))
        .join("");
      if (currentValue !== validValue) {
        inputElement.value = validValue;
        inputElement.dispatchEvent(new Event("input"));
      }
    });
  }

  @HostListener("input", ["$event"])
  /**
   * onInput function.
   * @param {*} event - Parameter.
   * @returns {*} Result.
   */
  onInput(event: any) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const newValue = inputElement.value;
    if (!this.regex.test(newValue)) {
      inputElement.value = newValue
        .split("")
        .filter((ch) => this.regex.test(ch))
        .join("");
      inputElement.dispatchEvent(new Event("input"));
    }
  }
}
