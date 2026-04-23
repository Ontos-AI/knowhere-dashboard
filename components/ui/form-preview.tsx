"use client";

import { Checkbox } from "@components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Textarea } from "@components/ui/textarea";

export const FormPreview = () => {
  return (
    <FieldGroup>
      <Field>
        <FieldContent>
          <FieldLabel>Input Tag</FieldLabel>
          <Input placeholder="harry@potter.com" />
        </FieldContent>
      </Field>

      <Field>
        <FieldContent>
          <FieldLabel>Select Tag</FieldLabel>
          <Select>
            <SelectTrigger className="text-slate-500">
              <SelectValue placeholder="Option 1" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option-1">Option 1</SelectItem>
              <SelectItem value="option-2">Option 2</SelectItem>
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      <Field>
        <FieldContent>
          <FieldLabel>Textarea</FieldLabel>
          <Textarea placeholder="Enter some long form content" />
        </FieldContent>
      </Field>

      <FieldSet>
        <FieldLegend variant="label">Checkboxes</FieldLegend>
        <div className="space-y-5">
          <Field orientation="horizontal">
            <Checkbox defaultChecked id="design-system-checkbox-1" />
            <FieldContent>
              <Label
                htmlFor="design-system-checkbox-1"
                className="cursor-pointer whitespace-nowrap text-base font-normal leading-6 text-[#020618]"
              >
                Option 1
              </Label>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="design-system-checkbox-2" />
            <FieldContent>
              <Label
                htmlFor="design-system-checkbox-2"
                className="cursor-pointer whitespace-nowrap text-base font-normal leading-6 text-[#020618]"
              >
                Option 2
              </Label>
            </FieldContent>
          </Field>
        </div>
      </FieldSet>

      <FieldSet>
        <FieldLegend variant="label">Radio Buttons</FieldLegend>
        <RadioGroup defaultValue="option-1">
          <Field orientation="horizontal">
            <RadioGroupItem id="design-system-radio-1" value="option-1" />
            <FieldContent>
              <Label
                htmlFor="design-system-radio-1"
                className="cursor-pointer whitespace-nowrap text-base font-normal leading-6 text-[#020618]"
              >
                Option 1
              </Label>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem id="design-system-radio-2" value="option-2" />
            <FieldContent>
              <Label
                htmlFor="design-system-radio-2"
                className="cursor-pointer whitespace-nowrap text-base font-normal leading-6 text-[#020618]"
              >
                Option 2
              </Label>
            </FieldContent>
          </Field>
        </RadioGroup>
      </FieldSet>
    </FieldGroup>
  );
};
