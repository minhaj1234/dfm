import { FormGroup } from "@angular/forms";
import { setFormAvailability } from "./form";

describe('form utilities', () => {
  describe('setFormAvailability', () => {
    it('should enable form', () => {
      const testFormGroup = new FormGroup({});
      setFormAvailability(testFormGroup, false);

      expect(testFormGroup.enabled).toBeTruthy();
    });

    it('should disable form', () => {
      const testFormGroup = new FormGroup({});
      setFormAvailability(testFormGroup, true);

      expect(testFormGroup.disabled).toBeTruthy();
    });
  });
});