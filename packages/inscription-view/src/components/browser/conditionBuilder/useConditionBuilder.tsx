import { IvyIcons } from '@axonivy/ui-icons';
import type { UseBrowserImplReturnValue } from '../useBrowser';
import type { BrowserValue } from '../Browser';
import { useState } from 'react';
import { generateConditionString, logicOperators, operators } from './conditionBuilderData';
import { ConditionBuilder } from '@axonivy/ui-components';
import InputWithBrowser from '../../widgets/input/InputWithBrowser';

export const CONDITION_BUILDER_ID = 'condition' as const;

export const useConditionBuilder = (): UseBrowserImplReturnValue => {
  const [value, setValue] = useState<BrowserValue>({ cursorValue: '' });

  return {
    id: CONDITION_BUILDER_ID,
    name: 'Condition',
    content: <ConditionBrowser value={value.cursorValue} onChange={setValue} />,
    accept: () => value,
    icon: IvyIcons.Process
  };
};

type ConditionBrowserProps = {
  value: string;
  onChange: (value: BrowserValue) => void;
};

const ConditionBrowser = ({ value, onChange }: ConditionBrowserProps) => {
  return (
    <>
      <ConditionBuilder
        onChange={change => onChange({ cursorValue: change })}
        generateConditionString={generateConditionString}
        logicOperators={logicOperators}
        operators={operators}
        argumentInput={(value, onChange) => <InputWithBrowser value={value} onChange={onChange} browsers={['attr']} style={{ flex: 1 }} />}
      />
      <pre className='browser-helptext'>
        <b>Generated Condition</b>
        <code>{value}</code>
      </pre>
    </>
  );
};
