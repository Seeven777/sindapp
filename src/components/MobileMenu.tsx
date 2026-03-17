import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutDashboard, Gift, Share2, Users, Newspaper, CreditCard, Calendar, ShieldCheck, Settings, LogOut } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const { profile } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['associado', 'admin', 'gestao', 'diretoria'] },
    { id: 'benefits', label: 'Benefícios', icon: Gift, roles: ['associado', 'admin', 'gestao', 'diretoria'] },
    { id: 'news', label: 'Comunicação', icon: Newspaper, roles: ['associado', 'admin', 'gestao', 'diretoria'] },
    { id: 'social-hub', label: 'Social Hub', icon: Share2, roles: ['associado', 'admin', 'gestao', 'diretoria'] },
    { id: 'community', label: 'Comunidade', icon: Users, roles: ['associado', 'admin', 'gestao', 'diretoria'] },
    { id: 'calculators', label: 'Calculadoras', icon: LayoutDashboard, roles: ['associado', 'admin', 'gestao', 'diretoria'] },
    { id: 'membership', label: 'Carteirinha', icon: CreditCard, roles: ['associado', 'admin', 'gestao', 'diretoria'] },
    { id: 'diretoria', label: 'Agenda Diretoria', icon: Calendar, roles: ['diretoria', 'admin', 'gestao'] },
    { id: 'denuncia', label: 'Denúncia', icon: ShieldCheck, roles: ['associado', 'admin', 'gestao', 'diretoria'] },
    { id: 'admin', label: 'Administração', icon: ShieldCheck, roles: ['admin', 'gestao'] },
    { id: 'profile', label: 'Meu Perfil', icon: Settings, roles: ['associado', 'admin', 'gestao', 'diretoria'] },
  ];

  const filteredItems = menuItems.filter(item => 
    profile && item.roles.includes(profile.role)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] md:hidden"
          />

          {/* Menu Content */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-h-[90vh] bg-[var(--bg-main)] border-t border-white/10 rounded-t-[2.5rem] z-[70] md:hidden overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-black text-[var(--text-main)] uppercase tracking-tighter">Menu Sindapp</h2>
              <button 
                onClick={onClose}
                className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-[var(--text-main)]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-3xl transition-all duration-300 border",
                    activeTab === item.id
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white/5 border-white/5 text-[var(--text-main)] opacity-60 hover:opacity-100"
                  )}
                >
                  <item.icon className={cn("w-7 h-7", activeTab === item.id ? "text-white" : "text-primary")} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-center">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="p-6 border-t border-white/5 bg-white/[0.02]">
              <button
                onClick={() => signOut(auth)}
                className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl text-red-500 bg-red-500/10 font-black uppercase tracking-widest text-xs"
              >
                <LogOut className="w-5 h-5" />
                Sair da Conta
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
