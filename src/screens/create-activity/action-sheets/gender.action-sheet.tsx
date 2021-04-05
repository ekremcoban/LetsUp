import React, { useState, forwardRef } from 'react';

import {
  ActionSheet,
  IActionSheet,
} from 'components/action-sheet/action-sheet';
import { Picker } from 'components/picker/picker';
import { genders } from 'models/genders';

interface IGenderActionSheetProps {
  onSelect: (value: string) => void;
  onCancel: () => void;
}

export const GenderActionSheet = forwardRef<
  IActionSheet,
  IGenderActionSheetProps
>((props, ref) => {
  const [selectedValue, setSelectedValue] = useState(genders[0].value);

  return (
    <ActionSheet
      ref={ref}
      onSelect={() => {
        props.onSelect(selectedValue);
      }}
      onCancel={props.onCancel}
      title={polyglot.t('screens.create_activity.action_sheets.gender.title')}
    >
      <Picker
        items={genders.map((gender) => ({
          value: gender.value,
          text: polyglot.t(gender.text),
        }))}
        selectedValue={selectedValue}
        onValueChange={setSelectedValue}
      />
    </ActionSheet>
  );
});
