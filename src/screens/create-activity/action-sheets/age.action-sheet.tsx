import React, { useState, forwardRef } from 'react';

import {
  ActionSheet,
  IActionSheet,
} from 'components/action-sheet/action-sheet';
import { Picker } from 'components/picker/picker';

interface IAgeActionSheetProps {
  onSelect: (values: number) => void;
  onCancel: () => void;
}

export const AgeActionSheet = forwardRef<IActionSheet, IAgeActionSheetProps>(
  (props, ref) => {
    const [selectedtAge, setSelectedAge] = useState(35);
    const [ages] = useState(
      Array(71)
        .fill(null)
        .map((_, index) => index + 7)
    );

    return (
      <ActionSheet
        ref={ref}
        onSelect={() => {
          props.onSelect(selectedtAge);
        }}
        onCancel={props.onCancel}
        title={polyglot.t('screens.create_activity.action_sheets.age.title')}
      >
        <Picker
          items={ages.map((age) => ({ value: age, text: `${age}` }))}
          selectedValue={selectedtAge}
          onValueChange={setSelectedAge}
        />
      </ActionSheet>
    );
  }
);
