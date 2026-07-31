import React from 'react';
import { Lock, KeyRound } from 'lucide-react';

interface AdminAuthViewProps {
  passcode: string;
  setPasscode: (val: string) => void;
  passcodeError: boolean;
  setPasscodeError: (val: boolean) => void;
  onLogin: (e: React.FormEvent) => void;
}

export const AdminAuthView: React.FC<AdminAuthViewProps> = ({
  passcode,
  setPasscode,
  passcodeError,
  setPasscodeError,
  onLogin
}) => {
  return (
    <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] flex items-center justify-center mx-auto shadow-sm">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-extrabold text-[#0F172A]">Admin Access Required</h3>
        <p className="text-sm text-[#475569] leading-relaxed">
          Enter your security passcode to access customer inquiry records and Supabase database controls.
        </p>
      </div>

      <form onSubmit={onLogin} className="space-y-4">
        <div>
          <input
            type="password"
            placeholder="Enter passcode (default: admin123)"
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value);
              setPasscodeError(false);
            }}
            className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border text-center text-[#0F172A] placeholder-[#94A3B8] text-sm focus:outline-none transition-colors font-mono tracking-widest ${
              passcodeError ? 'border-red-500 bg-red-50/50' : 'border-[#E2E8F0] focus:border-[#2563EB]'
            }`}
            autoFocus
          />
          {passcodeError && (
            <p className="text-xs text-red-500 mt-1 font-medium">
              Incorrect passcode. Try <code className="font-bold">admin123</code>
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <KeyRound className="w-4 h-4" />
          <span>Unlock Admin Panel</span>
        </button>
      </form>

      <div className="p-3 rounded-xl bg-[#F8FBFF] border border-[#DBEAFE] text-left text-xs text-[#475569] space-y-1">
        <span className="text-[#2563EB] font-bold block">💡 Default Passcode Info:</span>
        <p>
          The default system passcode is <code className="bg-[#EFF6FF] px-1.5 py-0.5 rounded font-mono text-[#2563EB] font-bold">admin123</code>.
        </p>
      </div>
    </div>
  );
};
