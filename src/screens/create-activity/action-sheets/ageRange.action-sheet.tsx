import React, { useState, forwardRef } from 'react';

import {
  ActionSheet,
  IActionSheet,
} from 'components/action-sheet/action-sheet';
import { Picker } from 'components/picker/picker';

interface IAgeActionSheetProps {
  onSelect: (values: [number, number]) => void;
  onCancel: () => void;
}

export const AgeRangeActionSheet = forwardRef<IActionSheet, IAgeActionSheetProps>(
  (props, ref) => {
    const [selectedMin, setSelectedMin] = useState(20);
    const [selectedMax, setSelectedMax] = useState(24);
    const [ages] = useState(
      Array(71)
        .fill(null)
        .map((_, index) => index + 7)
    );

    return (
      <ActionSheet
        ref={ref}
        onSelect={() => {
          props.onSelect([selectedMin, selectedMax]);
        }}
        onCancel={props.onCancel}
        title={polyglot.t('screens.create_activity.action_sheets.age.title')}
      >
        <Picker
          items={ages.map((age) => ({ value: age, text: `${age}` }))}
          selectedValue={selectedMin}
          onValueChange={setSelectedMin}
        />

        <Picker
          items={ages.map((age) => ({ value: age, text: `${age}` }))}
          selectedValue={selectedMax}
          onValueChange={setSelectedMax}
        />
      </ActionSheet>
    );
  }
);
