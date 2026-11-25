import {expect,test,vi} from 'vitest';
import {logPanelError,panelErrorMessage} from './diagnostics';

test('logs only bounded metadata and gives a fallback for an unknown failure',()=>{
 const logged=vi.spyOn(console,'error').mockImplementation(()=>{});
 const error={name:'Error',code:'secret token',status:500,requestId:'request-123',message:'private candidate data'};
 expect(panelErrorMessage('product-save',error)).toBe('Não foi possível concluir a operação. Tente novamente.');
 logPanelError('product-save',error);
 expect(logged).toHaveBeenCalledTimes(1);
 const line=logged.mock.calls[0][0];
 expect(line).toContain('"requestId":"request-123"');
 expect(line).toContain('"code":"UNKNOWN"');
 expect(line).not.toContain('private candidate data');
 expect(line).not.toContain('secret token');
 logged.mockRestore();
});
