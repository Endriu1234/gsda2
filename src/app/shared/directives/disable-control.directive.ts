import { Directive, Input } from '@angular/core';
import { MatFabButton } from '@angular/material/button';

@Directive({
  selector: '[disableMatFabButton]'
})
export class DisableMatFabButtonDirective {

  constructor(private button: MatFabButton) { }

  @Input() set disableMatFabButton(condition: boolean) {
    const action = condition ? 'disable' : 'enable';

    this.button.disabled = condition;
  }

}
