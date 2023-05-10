import React, { useEffect, useState } from 'react';
import { useField, observer, useFieldSchema } from '@formily/react';
import { AssociationFieldProvider } from './AssociationFieldProvider';
import { InternalNester } from './InternalNester';
import { ReadPrettyInternalViewer } from './InternalViewer';
import { AssociationSelectReadPretty } from './AssociationSelect';
import { useCollection, useCollectionManager } from '../../../collection-manager';
import { InternalSubTable } from './InternalSubTable';
import { FileManageReadPretty } from './FileManager';
import { ReadPrettyRecordPicker } from '../../antd/record-picker';

export const ReadPretty = observer((props: any) => {
  const field: any = useField();
  const fieldSchema = useFieldSchema();
  const { enableLink } = fieldSchema['x-component-props'];
  const { getField } = useCollection();
  const { getCollection } = useCollectionManager();
  const collectionField = getField(field.props.name);
  const isFileCollection = getCollection(collectionField?.target)?.template === 'file';
  const [currentMode, setCurrentMode] = useState(props.mode || (isFileCollection ? 'FileManager' : 'Select'));
  useEffect(() => {
    props.mode && setCurrentMode(props.mode);
  }, [props.mode]);

  const isOldRecordPicker = fieldSchema.reduceProperties((buf, schema) => {
    if (schema['x-component'].includes('RecordPicker.')) {
      return schema;
    }
    return buf;
  }, null);
  if (isOldRecordPicker && !props.mode) {
    return <ReadPrettyRecordPicker {...props} />;
  }
  return (
    <AssociationFieldProvider>
      {['Select', 'Picker'].includes(currentMode) && enableLink !== false && <ReadPrettyInternalViewer {...props} />}
      {currentMode === 'Nester' && <InternalNester {...props} />}
      {['Select', 'Picker'].includes(currentMode) && enableLink === false && <AssociationSelectReadPretty {...props} />}
      {currentMode === 'SubTable' && <InternalSubTable {...props} />}
      {currentMode === 'FileManager' && <FileManageReadPretty {...props} />}
    </AssociationFieldProvider>
  );
});
