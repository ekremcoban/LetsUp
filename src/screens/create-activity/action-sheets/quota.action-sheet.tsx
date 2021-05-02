import React, { useState, forwardRef } from 'react';

import {
  ActionSheet,
  IActionSheet,
} from 'components/action-sheet/action-sheet';
import { Picker } from 'components/picker/picker';

interface IQuotaActionSheetProps {
  onSelect: (values: [number, number]) => void;
  onCancel: () => void;
}

export const QuotaActionSheet = forwardRef<
  IActionSheet,
  IQuotaActionSheetProps
>((props, ref) => {
  const [selectedMin, setSelectedMin] = useState(3);
  const [selectedMax, setSelectedMax] = useState(5);
  const [quotas] = useState(
    Array(30)
      .fill(null)
      .map((_, index) => index + 1)
  );

  return (
    <ActionSheet
      ref={ref}
      onSelect={() => {
        props.onSelect([selectedMin, selectedMax]);
      }}
      onCancel={props.onCancel}
      title={polyglot.t('screens.create_activity.action_sheets.quota.title')}
    >
      <Picker
        items={quotas.map((quota) => ({ value: quota, text: `${quota}` }))}
        selectedValue={selectedMin}
        onValueChange={setSelectedMin}
      />

      <Picker
        items={quotas.map((quota) => ({ value: quota, text: `${quota}` }))}
        selectedValue={selectedMax}
        onValueChange={setSelectedMax}
      />
    </ActionSheet>
  );
});
