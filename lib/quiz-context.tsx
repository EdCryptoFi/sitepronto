'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

export type CatalogProduct = { id: string; name: string; price: string; imagePreview?: string };
export type PortfolioItem = { id: string; title: string; category: string; imagePreview?: string };

interface QuizState {
  // Etapa 1
  businessName: string;
  objective: string;
  // Etapa 2
  logoName: string;
  logoPreview: string;
  palette: string;
  template: string;
  selectedModules: string[];
  // Etapa 3
  description: string;
  domain: string;
  domainChoice: 'new' | 'later';
  portfolioItems: PortfolioItem[];
  businessHours: string;
  email: string;
  termsAccepted: boolean;
  // Legacy (kept for backward compat with checkout/site-generator)
  whatsappNumber: string;
  catalogProducts: CatalogProduct[];
  contentNotes: string;
  // Meta
  briefingId?: string;
  paymentStatus?: 'pending' | 'approved' | 'rejected';
}

type QuizAction =
  | { type: 'SET_BUSINESS_NAME'; payload: string }
  | { type: 'SET_OBJECTIVE'; payload: string }
  | { type: 'SET_LOGO'; payload: { name: string; preview: string } }
  | { type: 'SET_PALETTE'; payload: string }
  | { type: 'SET_TEMPLATE'; payload: string }
  | { type: 'TOGGLE_MODULE'; payload: string }
  | { type: 'SET_DESCRIPTION'; payload: string }
  | { type: 'SET_DOMAIN'; payload: string }
  | { type: 'SET_DOMAIN_CHOICE'; payload: 'new' | 'later' }
  | { type: 'ADD_PORTFOLIO_ITEM' }
  | { type: 'REMOVE_PORTFOLIO_ITEM'; payload: string }
  | { type: 'UPDATE_PORTFOLIO_ITEM'; payload: { id: string; field: 'title' | 'category' | 'imagePreview'; value: string } }
  | { type: 'SET_BUSINESS_HOURS'; payload: string }
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_TERMS_ACCEPTED'; payload: boolean }
  | { type: 'SET_WHATSAPP_NUMBER'; payload: string }
  | { type: 'ADD_CATALOG_PRODUCT' }
  | { type: 'REMOVE_CATALOG_PRODUCT'; payload: string }
  | { type: 'UPDATE_CATALOG_PRODUCT'; payload: { id: string; field: 'name' | 'price' | 'imagePreview'; value: string } }
  | { type: 'SET_CONTENT_NOTES'; payload: string }
  | { type: 'SET_BRIEFING_ID'; payload: string }
  | { type: 'SET_PAYMENT_STATUS'; payload: 'pending' | 'approved' | 'rejected' }
  | { type: 'LOAD_SAVED'; payload: Partial<QuizState> };

const initialState: QuizState = {
  businessName: '',
  objective: '',
  logoName: '',
  logoPreview: '',
  palette: 'corporate',
  template: '',
  selectedModules: ['servicos', 'contato'],
  description: '',
  domain: '',
  domainChoice: 'later',
  portfolioItems: [],
  businessHours: '',
  email: '',
  termsAccepted: false,
  whatsappNumber: '',
  catalogProducts: [],
  contentNotes: '',
};

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'SET_BUSINESS_NAME':
      return { ...state, businessName: action.payload };
    case 'SET_OBJECTIVE':
      return { ...state, objective: action.payload };
    case 'SET_LOGO':
      return { ...state, logoName: action.payload.name, logoPreview: action.payload.preview };
    case 'SET_PALETTE':
      return { ...state, palette: action.payload };
    case 'SET_TEMPLATE':
      return { ...state, template: action.payload };
    case 'TOGGLE_MODULE':
      return {
        ...state,
        selectedModules: state.selectedModules.includes(action.payload)
          ? state.selectedModules.filter((id) => id !== action.payload)
          : [...state.selectedModules, action.payload],
      };
    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'SET_DOMAIN':
      return { ...state, domain: action.payload };
    case 'SET_DOMAIN_CHOICE':
      return { ...state, domainChoice: action.payload };
    case 'ADD_PORTFOLIO_ITEM':
      if (state.portfolioItems.length >= 8) return state;
      return {
        ...state,
        portfolioItems: [...state.portfolioItems, { id: String(Date.now()), title: '', category: '' }],
      };
    case 'REMOVE_PORTFOLIO_ITEM':
      return { ...state, portfolioItems: state.portfolioItems.filter((p) => p.id !== action.payload) };
    case 'UPDATE_PORTFOLIO_ITEM':
      return {
        ...state,
        portfolioItems: state.portfolioItems.map((p) =>
          p.id === action.payload.id ? { ...p, [action.payload.field]: action.payload.value } : p
        ),
      };
    case 'SET_BUSINESS_HOURS':
      return { ...state, businessHours: action.payload };
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_TERMS_ACCEPTED':
      return { ...state, termsAccepted: action.payload };
    case 'SET_WHATSAPP_NUMBER':
      return { ...state, whatsappNumber: action.payload };
    case 'ADD_CATALOG_PRODUCT':
      if (state.catalogProducts.length >= 6) return state;
      return {
        ...state,
        catalogProducts: [...state.catalogProducts, { id: String(Date.now()), name: '', price: '' }],
      };
    case 'REMOVE_CATALOG_PRODUCT':
      return { ...state, catalogProducts: state.catalogProducts.filter((p) => p.id !== action.payload) };
    case 'UPDATE_CATALOG_PRODUCT':
      return {
        ...state,
        catalogProducts: state.catalogProducts.map((p) =>
          p.id === action.payload.id ? { ...p, [action.payload.field]: action.payload.value } : p
        ),
      };
    case 'SET_CONTENT_NOTES':
      return { ...state, contentNotes: action.payload };
    case 'SET_BRIEFING_ID':
      return { ...state, briefingId: action.payload };
    case 'SET_PAYMENT_STATUS':
      return { ...state, paymentStatus: action.payload };
    case 'LOAD_SAVED':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const QuizContext = createContext<{
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
} | null>(null);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sitepronto-quiz-v2');
      if (saved) {
        const data = JSON.parse(saved);
        dispatch({ type: 'LOAD_SAVED', payload: data });
      }
    } catch {
      // localStorage unavailable or corrupt
    }
  }, []);

  useEffect(() => {
    if (!state.businessName && !state.objective && !state.email) return;
    const { logoPreview, briefingId, paymentStatus, termsAccepted, ...toSave } = state;
    localStorage.setItem('sitepronto-quiz-v2', JSON.stringify(toSave));
  }, [
    state.businessName, state.objective, state.logoName,
    state.palette, state.template, state.selectedModules,
    state.description, state.domain, state.domainChoice,
    state.portfolioItems, state.businessHours,
    state.whatsappNumber, state.catalogProducts,
    state.email,
  ]);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
};
