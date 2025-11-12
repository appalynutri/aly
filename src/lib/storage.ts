// Gerenciamento de localStorage para persistência de dados

import { DailyLog, UserGoals, UserProfile } from './types';

const STORAGE_KEYS = {
  DAILY_LOGS: 'healthyapp_daily_logs',
  USER_GOALS: 'healthyapp_user_goals',
  USER_PROFILE: 'healthyapp_user_profile',
};

// Funções para Daily Logs
export const saveDailyLog = (log: DailyLog): void => {
  try {
    const logs = getDailyLogs();
    const existingIndex = logs.findIndex(l => l.date === log.date);
    
    if (existingIndex >= 0) {
      logs[existingIndex] = log;
    } else {
      logs.push(log);
    }
    
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error('Erro ao salvar log diário:', error);
  }
};

export const getDailyLogs = (): DailyLog[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao carregar logs diários:', error);
    return [];
  }
};

export const getTodayLog = (): DailyLog => {
  const today = new Date().toISOString().split('T')[0];
  const logs = getDailyLogs();
  const todayLog = logs.find(l => l.date === today);
  
  return todayLog || {
    date: today,
    meals: [],
    water: 0,
  };
};

// Funções para User Goals
export const saveUserGoals = (goals: UserGoals): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_GOALS, JSON.stringify(goals));
  } catch (error) {
    console.error('Erro ao salvar metas:', error);
  }
};

export const getUserGoals = (): UserGoals => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_GOALS);
    return data ? JSON.parse(data) : getDefaultGoals();
  } catch (error) {
    console.error('Erro ao carregar metas:', error);
    return getDefaultGoals();
  }
};

const getDefaultGoals = (): UserGoals => ({
  dailyCalories: 2000,
  dailyProtein: 150,
  dailyCarbs: 250,
  dailyFat: 65,
  dailyWater: 2000,
});

// Funções para User Profile
export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
  }
};

export const getUserProfile = (): UserProfile | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    return null;
  }
};

// Calcular metas baseadas no perfil
export const calculateGoalsFromProfile = (profile: UserProfile): UserGoals => {
  // Fórmula de Harris-Benedict para calcular TMB (Taxa Metabólica Basal)
  let bmr: number;
  
  if (profile.gender === 'male') {
    bmr = 88.362 + (13.397 * profile.currentWeight) + (4.799 * 170) - (5.677 * profile.age);
  } else {
    bmr = 447.593 + (9.247 * profile.currentWeight) + (3.098 * 160) - (4.330 * profile.age);
  }
  
  // Multiplicadores de atividade física
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  
  const tdee = bmr * activityMultipliers[profile.activityLevel];
  
  // Ajustar calorias baseado no objetivo
  const weightDiff = profile.currentWeight - profile.targetWeight;
  const dailyDeficit = (weightDiff * 7700) / profile.goalDays; // 7700 kcal = 1kg
  const targetCalories = Math.round(tdee - dailyDeficit);
  
  // Calcular macros (40% carbs, 30% protein, 30% fat)
  const protein = Math.round((targetCalories * 0.30) / 4);
  const carbs = Math.round((targetCalories * 0.40) / 4);
  const fat = Math.round((targetCalories * 0.30) / 9);
  
  return {
    dailyCalories: Math.max(1200, targetCalories), // Mínimo de 1200 kcal
    dailyProtein: protein,
    dailyCarbs: carbs,
    dailyFat: fat,
    dailyWater: 2000,
    targetWeight: profile.targetWeight,
  };
};

// Função para formatar data
export const formatDate = (date: string): string => {
  const d = new Date(date + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
};
