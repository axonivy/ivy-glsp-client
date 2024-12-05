import type { RestRequestData, RestResource } from '@axonivy/process-editor-inscription-protocol';
import { HTTP_METHOD } from '@axonivy/process-editor-inscription-protocol';
import { RestMethodSelect } from './RestMethodSelect';
import type { DeepPartial } from 'test-utils';
import { ComboboxUtil, SelectUtil, render, screen } from 'test-utils';
import { describe, test, expect } from 'vitest';
import { OpenApiContextProvider } from '../../../../../context/useOpenApi';

describe('RestMethodSelect', () => {
  function renderMethodSelect(data?: DeepPartial<RestRequestData>) {
    const restResources: DeepPartial<RestResource>[] = [
      { method: { httpMethod: 'GET' }, path: '/pet', doc: 'Get a random pet' },
      { method: { httpMethod: 'DELETE' }, path: '/pet/{petId}', doc: 'Delete a pet with given id' }
    ];
    render(
      <OpenApiContextProvider>
        <RestMethodSelect />
      </OpenApiContextProvider>,
      {
        wrapperProps: { data: data && { config: data }, meta: { restResources } }
      }
    );
  }

  test('empty', async () => {
    renderMethodSelect();
    expect(screen.getByRole('textbox')).toHaveValue('');
    await SelectUtil.assertValue('GET');
    await SelectUtil.assertOptionsCount(Object.keys(HTTP_METHOD).length);
  });

  test('empty - openapi', async () => {
    renderMethodSelect({ target: { clientId: 'client' } });
    await ComboboxUtil.assertValue('GET:');
  });

  test('data', async () => {
    renderMethodSelect({ target: { path: '/my/rest/api' }, method: 'DELETE' });
    expect(screen.getByRole('textbox')).toHaveValue('/my/rest/api');
    await SelectUtil.assertValue('DELETE');
  });

  test('data - openapi', async () => {
    renderMethodSelect({ target: { clientId: 'client', path: '/pet/{petId}' }, method: 'DELETE' });
    await ComboboxUtil.assertValue('DELETE:/pet/{petId}');
  });
});
