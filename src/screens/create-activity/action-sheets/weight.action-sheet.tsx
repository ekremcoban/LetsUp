import React, { useState, forwardRef } from 'react';
import {
  ActionSheet,
  IActionSheet,
} from 'components/action-sheet/action-sheet';
import { Picker } from 'components/picker/picker';

interface IWeightActionSheetProps {
  onSelect: (values: [number, number]) => void;
  onCancel: () => void;
}

export const WeightActionSheet = forwardRef<IActionSheet, IWeightActionSheetProps>(
  (props, ref) => {
    const [selectedKg, setSelectedKg] = useState(68);
    const [selectedGr, setSelectedGr] = useState(50);
    const [weight] = useState(
      Array(120)
        .fill(null)
        .map((_, index) => index)
    );

    return (
      <ActionSheet
        ref={ref}
        onSelect={() => {
          props.onSelect([selectedKg, selectedGr]);
        }}
        onCancel={props.onCancel}
        title={polyglot.t('screens.create_activity.action_sheets.age.title')}
      >
        <Picker
          items={weight.filter(x => x > 39).map((kg) => ({ value: kg, text: `${kg} kg` }))}
          selectedValue={selectedKg}
          onValueChange={setSelectedKg}
        />

        <Picker
          items={weight.filter(x => x % 10 === 0 && x < 100).map((gr) => ({ value: gr, text: `${gr} gr` }))}
          selectedValue={selectedGr}
          onValueChange={setSelectedGr}
        />
      </ActionSheet>
    );
  }
);
