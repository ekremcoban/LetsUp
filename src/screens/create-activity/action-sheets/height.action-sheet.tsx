import React, { useState, forwardRef } from 'react';

import {
  ActionSheet,
  IActionSheet,
} from 'components/action-sheet/action-sheet';
import { Picker } from 'components/picker/picker';

interface IHeightActionSheetProps {
  onSelect: (values: [number, number]) => void;
  onCancel: () => void;
}

export const HeightActionSheet = forwardRef<IActionSheet, IHeightActionSheetProps>(
  (props, ref) => {
    const [selectedMeter, setSelectedMeter] = useState(1);
    const [selectedCm, setSelectedCm] = useState(70);
    const [height] = useState(
      Array(100)
        .fill(null)
        .map((_, index) => index)
    );

    return (
      <ActionSheet
        ref={ref}
        onSelect={() => {
          props.onSelect([selectedMeter, selectedCm]);
        }}
        onCancel={props.onCancel}
        title={polyglot.t('screens.create_activity.action_sheets.age.title')}
      >
        <Picker
          items={height.filter(x => x > 0 && x < 3).map((meter) => ({ value: meter, text: `${meter} m` }))}
          selectedValue={selectedMeter}
          onValueChange={setSelectedMeter}
        />

        <Picker
          items={height.map((cm) => ({ value: cm, text: `${cm} cm` }))}
          selectedValue={selectedCm}
          onValueChange={setSelectedCm}
        />
      </ActionSheet>
    );
  }
);
