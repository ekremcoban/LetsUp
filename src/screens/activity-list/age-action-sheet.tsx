import React, { useState, forwardRef } from 'react';

import {
  ActionSheet,
  IActionSheet,
} from 'components/action-sheet/action-sheet';
import { Picker } from 'components/picker/picker';

interface IAgeActionSheetProps {
  onSelect: (values: [number, number]) => void;
}

export const AgeActionSheet = forwardRef<IActionSheet, IAgeActionSheetProps>(
  (props, ref) => {
    const [selectedMin, setSelectedMin] = useState(18);
    const [selectedMax, setSelectedMax] = useState(18);
    const [ages] = useState(
      Array(71)
        .fill(null)
        .map((_, index) => index + 10)
    );

    return (
      <ActionSheet
        ref={ref}
        onSelect={() => {
          props.onSelect([selectedMin, selectedMax]);
        }}
        onCancel={() => {
          props.onSelect([selectedMin, selectedMax]);
        }}
        title="Pick age range"
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
