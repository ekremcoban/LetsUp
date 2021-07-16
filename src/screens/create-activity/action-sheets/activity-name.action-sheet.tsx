import React, { useState, forwardRef } from 'react';

import {
  ActionSheet,
  IActionSheet,
} from 'components/action-sheet/action-sheet';
import { Picker } from 'components/picker/picker';
import { activityNames } from 'models/activity-names';

interface IActivityNameActionSheetProps {
  branchName: String;
  onSelect: (value: number) => void;
  onCancel: () => void;
}

export const ActivityNameActionSheet = forwardRef<
  IActionSheet,
  IActivityNameActionSheetProps
>((props, ref) => {
  const [selectedValue, setSelectedValue] = useState(activityNames[0].value);

  return (
    <ActionSheet
      ref={ref}
      onSelect={() => {
        props.onSelect(selectedValue);
      }}
      onCancel={props.onCancel}
      title={polyglot.t(
        'screens.create_activity.action_sheets.activity_name.title'
      )}
    >
      <Picker
        fluid
        items={activityNames.filter(a => a.value < 3).map((activityName) => ({
          value: activityName.value,
          text: polyglot.t(activityName.text),
        }))}
        selectedValue={selectedValue}
        onValueChange={setSelectedValue}
      />
    </ActionSheet>
  );
});
