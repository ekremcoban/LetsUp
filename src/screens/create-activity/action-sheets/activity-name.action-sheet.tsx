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

  const items = () => {
    console.log('branch', props.branchName)
    if (props.branchName === 'jogging') {
      return activityNames.filter(a => a.value >= 1 && a.value < 6).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }

    if (props.branchName === 'basketball') {
      return activityNames.filter(a => a.value >= 6 && a.value < 11).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }

    if (props.branchName === 'bicycle') {
      return activityNames.filter(a => a.value >= 11 && a.value < 16).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }
    
    if (props.branchName === 'hiking') {
      return activityNames.filter(a => a.value >= 16 && a.value < 21).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }

    if (props.branchName === 'tennis') {
      return activityNames.filter(a => a.value >= 21 && a.value < 26).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }

    if (props.branchName === 'bowling') {
      return activityNames.filter(a => a.value >= 26 && a.value < 31).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }

    if (props.branchName === 'frisbee') {
      return activityNames.filter(a => a.value >= 31 && a.value < 36).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }

  }

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
        items={items()}
        selectedValue={selectedValue}
        onValueChange={setSelectedValue}
      />
    </ActionSheet>
  );
});
