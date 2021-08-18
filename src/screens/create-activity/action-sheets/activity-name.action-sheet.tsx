import React, { useState, forwardRef } from 'react';

import {
  ActionSheet,
  IActionSheet,
} from 'components/action-sheet/action-sheet';
import { Picker } from 'components/picker/picker';
import { activityNames } from 'models/activity-names';

interface IActivityNameActionSheetProps {
  title: string | undefined;
  branchName: string | undefined;
  onSelect: (value: number) => void;
  onCancel: () => void;
}

export const ActivityNameActionSheet = forwardRef<
  IActionSheet,
  IActivityNameActionSheetProps
>((props, ref) => {
  const [selectedValue, setSelectedValue] = useState(0);

  const items = () => {
    if (props.branchName === 'jogging') {
      return activityNames.filter(a => a.value >= 0 && a.value < 6).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }

    else if (props.branchName === 'basketball') {
      return activityNames.filter(a => a.value >= 6 && a.value < 12).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }

    else if (props.branchName === 'bicycle') {
      return activityNames.filter(a => a.value >= 12 && a.value < 18).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }
    
    else if (props.branchName === 'hiking') {
      return activityNames.filter(a => a.value >= 18 && a.value < 24).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }

    else if (props.branchName === 'table_tennis') {
      return activityNames.filter(a => a.value >= 24 && a.value < 30).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }

    else if (props.branchName === 'bowling') {
      return activityNames.filter(a => a.value >= 30 && a.value < 36).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }

    else if (props.branchName === 'frisbee') {
      return activityNames.filter(a => a.value >= 36 && a.value < 42).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }

    else if (props.branchName === 'volleyball') {
      return activityNames.filter(a => a.value >= 42 && a.value < 48).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }

    else if (props.branchName === 'badminton') {
      return activityNames.filter(a => a.value >= 48 && a.value < 54).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }

    else  if (props.branchName === 'meditation') {
      return activityNames.filter(a => a.value >= 54 && a.value < 60).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }

    else if (props.branchName === 'roller_skate') {
      return activityNames.filter(a => a.value >= 60 && a.value < 66).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }

    else if (props.branchName === 'skateboard') {
      return activityNames.filter(a => a.value >= 66 && a.value < 72).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }

    else if (props.branchName === 'tennis') {
      return activityNames.filter(a => a.value >= 72 && a.value < 78).map((activityName) => ({
        value: activityName.value,
        text: polyglot.t(activityName.text),
      }))
    }

    else if (props.branchName === 'feedback') {
      return activityNames.filter(a => a.value >= 78 && a.value < 82).map((activityName) => ({
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
      title={props.title}
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
