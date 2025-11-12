'use client';

import { useState, useEffect } from 'react';
import { 
  Apple, 
  Droplet, 
  TrendingUp, 
  Plus, 
  Utensils, 
  Coffee, 
  Sun, 
  Moon,
  Target,
  Activity,
  Flame,
  X,
  Check,
  ChefHat,
  Sparkles,
  Award,
  Star,
  BookOpen,
  Heart,
  Zap,
  TrendingDown,
  Calendar,
  Clock,
  ArrowRight,
  User,
  Weight,
  Cake,
  Dumbbell,
  Home,
  Info
} from 'lucide-react';
import { Meal, DailyLog, UserGoals, NutritionSummary, UserProfile } from '@/lib/types';
import { 
  saveDailyLog, 
  getTodayLog, 
  getUserGoals, 
  saveUserGoals,
  formatDate,
  getUserProfile,
  saveUserProfile,
  calculateGoalsFromProfile
} from '@/lib/storage';

// Receitas sugeridas com alimentos brasileiros (com informações nutricionais detalhadas)
const RECIPES = [
  {
    id: 1,
    name: 'Tapioca com Frango',
    calories: 280,
    protein: 22,
    carbs: 35,
    fat: 6,
    fiber: 2,
    sodium: 320,
    sugar: 1,
    time: '10 min',
    difficulty: 'Fácil',
    emoji: '🫓',
    color: 'from-yellow-400 to-orange-500',
    ingredients: ['Tapioca', 'Frango desfiado', 'Tomate', 'Cebola']
  },
  {
    id: 2,
    name: 'Arroz Integral com Feijão',
    calories: 350,
    protein: 18,
    carbs: 58,
    fat: 4,
    fiber: 12,
    sodium: 280,
    sugar: 2,
    time: '30 min',
    difficulty: 'Fácil',
    emoji: '🍚',
    color: 'from-amber-400 to-orange-500',
    ingredients: ['Arroz integral', 'Feijão preto', 'Alho', 'Cebola']
  },
  {
    id: 3,
    name: 'Frango Grelhado com Batata Doce',
    calories: 420,
    protein: 38,
    carbs: 42,
    fat: 10,
    fiber: 6,
    sodium: 380,
    sugar: 8,
    time: '25 min',
    difficulty: 'Médio',
    emoji: '🍗',
    color: 'from-orange-400 to-red-500',
    ingredients: ['Peito de frango', 'Batata doce', 'Azeite', 'Temperos']
  },
  {
    id: 4,
    name: 'Omelete com Tomate',
    calories: 220,
    protein: 16,
    carbs: 8,
    fat: 14,
    fiber: 2,
    sodium: 420,
    sugar: 3,
    time: '8 min',
    difficulty: 'Fácil',
    emoji: '🍳',
    color: 'from-yellow-400 to-orange-500',
    ingredients: ['Ovos', 'Tomate', 'Cebola', 'Queijo light']
  },
  {
    id: 5,
    name: 'Salada de Frutas Tropical',
    calories: 180,
    protein: 3,
    carbs: 42,
    fat: 2,
    fiber: 8,
    sodium: 5,
    sugar: 32,
    time: '5 min',
    difficulty: 'Fácil',
    emoji: '🥗',
    color: 'from-green-400 to-emerald-500',
    ingredients: ['Mamão', 'Banana', 'Abacaxi', 'Manga', 'Mel']
  },
  {
    id: 6,
    name: 'Pão Integral com Atum',
    calories: 310,
    protein: 28,
    carbs: 32,
    fat: 8,
    fiber: 5,
    sodium: 520,
    sugar: 4,
    time: '5 min',
    difficulty: 'Fácil',
    emoji: '🥪',
    color: 'from-blue-400 to-cyan-500',
    ingredients: ['Pão integral', 'Atum', 'Alface', 'Tomate']
  }
];

// Alimentos rápidos brasileiros (com informações nutricionais completas)
const QUICK_FOODS = [
  { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3, sugar: 14, emoji: '🍌' },
  { name: 'Maçã', calories: 95, protein: 0, carbs: 25, fat: 0, fiber: 4, sugar: 19, emoji: '🍎' },
  { name: 'Pão Francês', calories: 135, protein: 4, carbs: 28, fat: 1, fiber: 1, sugar: 2, emoji: '🥖' },
  { name: 'Ovo Cozido', calories: 78, protein: 6, carbs: 1, fat: 5, fiber: 0, sugar: 0, emoji: '🥚' },
  { name: 'Castanha do Pará (30g)', calories: 196, protein: 4, carbs: 3, fat: 20, fiber: 2, sugar: 1, emoji: '🥜' },
  { name: 'Iogurte Natural', calories: 150, protein: 15, carbs: 8, fat: 8, fiber: 0, sugar: 8, emoji: '🥛' }
];

// Exercícios para fazer em casa (detalhados)
const HOME_EXERCISES = [
  {
    id: 1,
    name: 'Flexão de Braço',
    category: 'Peito e Tríceps',
    difficulty: 'Médio',
    duration: '3 séries de 10-15 repetições',
    calories: 50,
    emoji: '💪',
    color: 'from-red-500 to-orange-600',
    instructions: [
      'Posição inicial: mãos no chão na largura dos ombros',
      'Corpo reto da cabeça aos pés',
      'Desça o corpo flexionando os cotovelos',
      'Empurre de volta à posição inicial',
      'Mantenha o core contraído durante todo movimento'
    ],
    tips: 'Iniciantes: apoie os joelhos no chão. Avançados: eleve os pés.',
    muscles: ['Peitoral', 'Tríceps', 'Ombros', 'Core']
  },
  {
    id: 2,
    name: 'Agachamento',
    category: 'Pernas e Glúteos',
    difficulty: 'Fácil',
    duration: '3 séries de 15-20 repetições',
    calories: 60,
    emoji: '🦵',
    color: 'from-blue-500 to-cyan-600',
    instructions: [
      'Pés na largura dos ombros',
      'Desça como se fosse sentar em uma cadeira',
      'Joelhos alinhados com os pés',
      'Desça até coxas paralelas ao chão',
      'Suba empurrando pelos calcanhares'
    ],
    tips: 'Mantenha o peso nos calcanhares e peito erguido.',
    muscles: ['Quadríceps', 'Glúteos', 'Isquiotibiais', 'Core']
  },
  {
    id: 3,
    name: 'Prancha Abdominal',
    category: 'Core e Abdômen',
    difficulty: 'Médio',
    duration: '3 séries de 30-60 segundos',
    calories: 40,
    emoji: '🧘',
    color: 'from-green-500 to-emerald-600',
    instructions: [
      'Apoie antebraços e pontas dos pés no chão',
      'Corpo reto da cabeça aos pés',
      'Cotovelos alinhados com os ombros',
      'Contraia abdômen e glúteos',
      'Mantenha a posição sem deixar quadril cair'
    ],
    tips: 'Respire normalmente. Não deixe o quadril subir ou descer.',
    muscles: ['Abdômen', 'Core', 'Ombros', 'Glúteos']
  },
  {
    id: 4,
    name: 'Burpee',
    category: 'Corpo Inteiro',
    difficulty: 'Difícil',
    duration: '3 séries de 8-12 repetições',
    calories: 80,
    emoji: '🔥',
    color: 'from-orange-500 to-red-600',
    instructions: [
      'Comece em pé',
      'Agache e apoie as mãos no chão',
      'Jogue os pés para trás (posição de flexão)',
      'Faça uma flexão (opcional)',
      'Pule os pés de volta e salte para cima'
    ],
    tips: 'Exercício intenso! Mantenha ritmo constante.',
    muscles: ['Corpo inteiro', 'Cardio', 'Resistência']
  },
  {
    id: 5,
    name: 'Afundo (Lunge)',
    category: 'Pernas e Glúteos',
    difficulty: 'Médio',
    duration: '3 séries de 10-12 rep (cada perna)',
    calories: 55,
    emoji: '🚶',
    color: 'from-purple-500 to-pink-600',
    instructions: [
      'Pé direito à frente, esquerdo atrás',
      'Desça flexionando ambos os joelhos',
      'Joelho da frente não ultrapassa a ponta do pé',
      'Joelho de trás quase toca o chão',
      'Suba e alterne as pernas'
    ],
    tips: 'Mantenha tronco ereto e olhar para frente.',
    muscles: ['Quadríceps', 'Glúteos', 'Isquiotibiais', 'Equilíbrio']
  },
  {
    id: 6,
    name: 'Polichinelo',
    category: 'Cardio',
    difficulty: 'Fácil',
    duration: '3 séries de 30-45 segundos',
    calories: 45,
    emoji: '⚡',
    color: 'from-yellow-500 to-orange-600',
    instructions: [
      'Comece em pé, pés juntos, braços ao lado',
      'Salte abrindo pernas e levantando braços',
      'Bata palmas acima da cabeça',
      'Salte voltando à posição inicial',
      'Mantenha ritmo constante'
    ],
    tips: 'Ótimo aquecimento! Mantenha joelhos levemente flexionados.',
    muscles: ['Cardio', 'Pernas', 'Ombros', 'Coordenação']
  },
  {
    id: 7,
    name: 'Mountain Climber',
    category: 'Core e Cardio',
    difficulty: 'Médio',
    duration: '3 séries de 20-30 segundos',
    calories: 65,
    emoji: '🏔️',
    color: 'from-cyan-500 to-blue-600',
    instructions: [
      'Posição de prancha alta (mãos no chão)',
      'Traga joelho direito em direção ao peito',
      'Volte e traga joelho esquerdo',
      'Alterne rapidamente como se estivesse correndo',
      'Mantenha quadril estável'
    ],
    tips: 'Quanto mais rápido, mais intenso. Core sempre contraído.',
    muscles: ['Core', 'Cardio', 'Ombros', 'Pernas']
  },
  {
    id: 8,
    name: 'Tríceps no Banco',
    category: 'Tríceps',
    difficulty: 'Fácil',
    duration: '3 séries de 12-15 repetições',
    calories: 35,
    emoji: '💺',
    color: 'from-indigo-500 to-purple-600',
    instructions: [
      'Sente na borda de cadeira/sofá',
      'Mãos na borda, dedos para frente',
      'Deslize o quadril para frente',
      'Desça flexionando os cotovelos',
      'Empurre de volta usando os tríceps'
    ],
    tips: 'Cotovelos para trás, não para os lados.',
    muscles: ['Tríceps', 'Ombros', 'Peito']
  }
];

// Dicas de nutrição
const NUTRITION_TIPS = [
  { icon: '💧', tip: 'Beba água ao acordar para hidratar seu corpo', color: 'from-cyan-500 to-blue-600' },
  { icon: '🥗', tip: 'Inclua vegetais coloridos em todas as refeições', color: 'from-green-500 to-emerald-600' },
  { icon: '🍳', tip: 'Proteína no café da manhã mantém saciedade', color: 'from-orange-500 to-red-600' },
  { icon: '🏃', tip: 'Combine alimentação saudável com exercícios', color: 'from-purple-500 to-pink-600' },
  { icon: '😴', tip: 'Durma bem para regular hormônios da fome', color: 'from-indigo-500 to-purple-600' },
  { icon: '🥑', tip: 'Gorduras boas são essenciais para saúde', color: 'from-lime-500 to-green-600' }
];

export default function HealthyApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [userGoals, setUserGoals] = useState<UserGoals | null>(null);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showNutritionInfo, setShowNutritionInfo] = useState(false);
  const [showExerciseDetail, setShowExerciseDetail] = useState<typeof HOME_EXERCISES[0] | null>(null);
  const [currentTip, setCurrentTip] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'recipes' | 'quick' | 'exercises'>('overview');

  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    type: 'breakfast' as Meal['type']
  });

  // Dados temporários do onboarding
  const [tempProfile, setTempProfile] = useState<Partial<UserProfile>>({
    gender: 'male',
    activityLevel: 'moderate'
  });

  // Carregar dados do localStorage
  useEffect(() => {
    const profile = getUserProfile();
    setUserProfile(profile);
    
    if (profile?.onboardingCompleted) {
      setTodayLog(getTodayLog());
      setUserGoals(getUserGoals());
    }
    
    setIsLoading(false);
  }, []);

  // Rotacionar dicas a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % NUTRITION_TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Completar onboarding
  const completeOnboarding = () => {
    if (!tempProfile.currentWeight || !tempProfile.targetWeight || !tempProfile.age || 
        !tempProfile.birthDate || !tempProfile.goalDays || !tempProfile.height) {
      return;
    }

    const profile: UserProfile = {
      currentWeight: tempProfile.currentWeight,
      targetWeight: tempProfile.targetWeight,
      height: tempProfile.height,
      age: tempProfile.age,
      gender: tempProfile.gender || 'male',
      activityLevel: tempProfile.activityLevel || 'moderate',
      birthDate: tempProfile.birthDate,
      goalDays: tempProfile.goalDays,
      startDate: new Date().toISOString(),
      onboardingCompleted: true
    };

    saveUserProfile(profile);
    const goals = calculateGoalsFromProfile(profile);
    saveUserGoals(goals);
    
    setUserProfile(profile);
    setUserGoals(goals);
    setTodayLog(getTodayLog());
  };

  // Calcular resumo nutricional
  const calculateSummary = (): NutritionSummary => {
    if (!todayLog || !userGoals) {
      return {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        caloriesRemaining: 0,
        proteinRemaining: 0,
        carbsRemaining: 0,
        fatRemaining: 0,
      };
    }

    const totals = todayLog.meals.reduce(
      (acc, meal) => ({
        totalCalories: acc.totalCalories + meal.calories,
        totalProtein: acc.totalProtein + meal.protein,
        totalCarbs: acc.totalCarbs + meal.carbs,
        totalFat: acc.totalFat + meal.fat,
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    );

    return {
      ...totals,
      caloriesRemaining: userGoals.dailyCalories - totals.totalCalories,
      proteinRemaining: userGoals.dailyProtein - totals.totalProtein,
      carbsRemaining: userGoals.dailyCarbs - totals.totalCarbs,
      fatRemaining: userGoals.dailyFat - totals.totalFat,
    };
  };

  const summary = calculateSummary();

  // Adicionar refeição
  const handleAddMeal = () => {
    if (!todayLog || !newMeal.name || !newMeal.calories) return;

    const meal: Meal = {
      id: Date.now().toString(),
      name: newMeal.name,
      calories: Number(newMeal.calories),
      protein: Number(newMeal.protein) || 0,
      carbs: Number(newMeal.carbs) || 0,
      fat: Number(newMeal.fat) || 0,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: newMeal.type,
    };

    const updatedLog = {
      ...todayLog,
      meals: [...todayLog.meals, meal],
    };

    setTodayLog(updatedLog);
    saveDailyLog(updatedLog);
    setShowAddMeal(false);
    setNewMeal({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      type: 'breakfast',
    });
  };

  // Adicionar receita como refeição
  const handleAddRecipe = (recipe: typeof RECIPES[0]) => {
    if (!todayLog) return;

    const meal: Meal = {
      id: Date.now().toString(),
      name: recipe.name,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: 'lunch',
    };

    const updatedLog = {
      ...todayLog,
      meals: [...todayLog.meals, meal],
    };

    setTodayLog(updatedLog);
    saveDailyLog(updatedLog);
  };

  // Adicionar alimento rápido
  const handleAddQuickFood = (food: typeof QUICK_FOODS[0]) => {
    if (!todayLog) return;

    const meal: Meal = {
      id: Date.now().toString(),
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: 'snack',
    };

    const updatedLog = {
      ...todayLog,
      meals: [...todayLog.meals, meal],
    };

    setTodayLog(updatedLog);
    saveDailyLog(updatedLog);
  };

  // Remover refeição
  const handleRemoveMeal = (mealId: string) => {
    if (!todayLog) return;

    const updatedLog = {
      ...todayLog,
      meals: todayLog.meals.filter(m => m.id !== mealId),
    };

    setTodayLog(updatedLog);
    saveDailyLog(updatedLog);
  };

  // Adicionar água
  const handleAddWater = (amount: number) => {
    if (!todayLog) return;

    const updatedLog = {
      ...todayLog,
      water: todayLog.water + amount,
    };

    setTodayLog(updatedLog);
    saveDailyLog(updatedLog);
  };

  // Atualizar metas
  const handleUpdateGoals = (goals: Partial<UserGoals>) => {
    if (!userGoals) return;

    const updatedGoals = { ...userGoals, ...goals };
    setUserGoals(updatedGoals);
    saveUserGoals(updatedGoals);
    setShowGoalsModal(false);
  };

  const getMealIcon = (type: Meal['type']) => {
    switch (type) {
      case 'breakfast':
        return <Coffee className="w-5 h-5" />;
      case 'lunch':
        return <Sun className="w-5 h-5" />;
      case 'dinner':
        return <Moon className="w-5 h-5" />;
      case 'snack':
        return <Apple className="w-5 h-5" />;
    }
  };

  const getMealLabel = (type: Meal['type']) => {
    const labels = {
      breakfast: 'Café da Manhã',
      lunch: 'Almoço',
      dinner: 'Jantar',
      snack: 'Lanche',
    };
    return labels[type];
  };

  // Calcular dias desde o início e data final
  const getDaysSinceStart = () => {
    if (!userProfile?.startDate) return 0;
    const start = new Date(userProfile.startDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGoalEndDate = () => {
    if (!userProfile?.startDate || !userProfile?.goalDays) return '';
    const start = new Date(userProfile.startDate);
    const endDate = new Date(start.getTime() + (userProfile.goalDays * 24 * 60 * 60 * 1000));
    return endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-emerald-400 font-medium">Carregando ALY...</p>
        </div>
      </div>
    );
  }

  // Renderizar onboarding
  if (!userProfile?.onboardingCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Header do Onboarding */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl shadow-2xl">
                <Apple className="w-20 h-20 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Bem-vindo ao ALY
            </h1>
            <p className="text-gray-400 text-lg font-medium">Vamos personalizar sua jornada saudável</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-gray-300">Passo {onboardingStep + 1} de 8</span>
              <span className="text-sm font-bold text-emerald-400">{Math.round(((onboardingStep + 1) / 8) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${((onboardingStep + 1) / 8) * 100}%` }}
              />
            </div>
          </div>

          {/* Conteúdo do Onboarding */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-gray-700">
            {/* Passo 1: Sexo */}
            {onboardingStep === 0 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <User className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-black text-white mb-2">Qual é o seu sexo?</h2>
                  <p className="text-gray-400">Isso nos ajuda a calcular suas necessidades nutricionais</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTempProfile({ ...tempProfile, gender: 'male' })}
                    className={`p-8 rounded-2xl border-4 transition-all duration-300 ${
                      tempProfile.gender === 'male'
                        ? 'border-emerald-500 bg-emerald-500/20 shadow-xl scale-105'
                        : 'border-gray-700 hover:border-emerald-500/50 hover:shadow-lg bg-gray-800/30'
                    }`}
                  >
                    <div className="text-6xl mb-4">👨</div>
                    <p className="text-xl font-bold text-white">Masculino</p>
                  </button>
                  <button
                    onClick={() => setTempProfile({ ...tempProfile, gender: 'female' })}
                    className={`p-8 rounded-2xl border-4 transition-all duration-300 ${
                      tempProfile.gender === 'female'
                        ? 'border-emerald-500 bg-emerald-500/20 shadow-xl scale-105'
                        : 'border-gray-700 hover:border-emerald-500/50 hover:shadow-lg bg-gray-800/30'
                    }`}
                  >
                    <div className="text-6xl mb-4">👩</div>
                    <p className="text-xl font-bold text-white">Feminino</p>
                  </button>
                </div>
              </div>
            )}

            {/* Passo 2: Idade e Data de Nascimento */}
            {onboardingStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Cake className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-black text-white mb-2">Qual é a sua idade?</h2>
                  <p className="text-gray-400">E sua data de nascimento</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Idade</label>
                    <input
                      type="number"
                      value={tempProfile.age || ''}
                      onChange={(e) => setTempProfile({ ...tempProfile, age: Number(e.target.value) })}
                      className="w-full px-6 py-4 border-2 border-gray-700 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-bold text-2xl text-center"
                      placeholder="25"
                      min="10"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Data de Nascimento</label>
                    <input
                      type="date"
                      value={tempProfile.birthDate || ''}
                      onChange={(e) => setTempProfile({ ...tempProfile, birthDate: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-700 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-bold text-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Passo 3: Altura */}
            {onboardingStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <TrendingUp className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-black text-white mb-2">Qual é a sua altura?</h2>
                  <p className="text-gray-400">Em centímetros (cm)</p>
                </div>
                <div>
                  <input
                    type="number"
                    value={tempProfile.height || ''}
                    onChange={(e) => setTempProfile({ ...tempProfile, height: Number(e.target.value) })}
                    className="w-full px-6 py-8 border-2 border-gray-700 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-black text-5xl text-center"
                    placeholder="170"
                    step="1"
                    min="100"
                    max="250"
                  />
                  <p className="text-center text-gray-400 mt-4 font-medium">cm</p>
                </div>
              </div>
            )}

            {/* Passo 4: Peso Atual */}
            {onboardingStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Weight className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-black text-white mb-2">Qual é o seu peso atual?</h2>
                  <p className="text-gray-400">Em quilogramas (kg)</p>
                </div>
                <div>
                  <input
                    type="number"
                    value={tempProfile.currentWeight || ''}
                    onChange={(e) => setTempProfile({ ...tempProfile, currentWeight: Number(e.target.value) })}
                    className="w-full px-6 py-8 border-2 border-gray-700 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-black text-5xl text-center"
                    placeholder="70"
                    step="0.1"
                    min="30"
                    max="300"
                  />
                  <p className="text-center text-gray-400 mt-4 font-medium">kg</p>
                </div>
              </div>
            )}

            {/* Passo 5: Meta de Peso */}
            {onboardingStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Target className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-black text-white mb-2">Qual é a sua meta de peso?</h2>
                  <p className="text-gray-400">Em quilogramas (kg)</p>
                </div>
                <div>
                  <input
                    type="number"
                    value={tempProfile.targetWeight || ''}
                    onChange={(e) => setTempProfile({ ...tempProfile, targetWeight: Number(e.target.value) })}
                    className="w-full px-6 py-8 border-2 border-gray-700 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-black text-5xl text-center"
                    placeholder="65"
                    step="0.1"
                    min="30"
                    max="300"
                  />
                  <p className="text-center text-gray-400 mt-4 font-medium">kg</p>
                  {tempProfile.currentWeight && tempProfile.targetWeight && (
                    <div className="mt-6 p-4 bg-emerald-500/20 rounded-xl text-center border border-emerald-500/30">
                      <p className="text-emerald-400 font-bold text-lg">
                        {tempProfile.currentWeight > tempProfile.targetWeight ? (
                          <>Você quer perder {(tempProfile.currentWeight - tempProfile.targetWeight).toFixed(1)} kg 🎯</>
                        ) : (
                          <>Você quer ganhar {(tempProfile.targetWeight - tempProfile.currentWeight).toFixed(1)} kg 💪</>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Passo 6: Prazo */}
            {onboardingStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Calendar className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-black text-white mb-2">Em quantos dias quer alcançar sua meta?</h2>
                  <p className="text-gray-400">Seja realista para melhores resultados</p>
                </div>
                <div>
                  <input
                    type="number"
                    value={tempProfile.goalDays || ''}
                    onChange={(e) => setTempProfile({ ...tempProfile, goalDays: Number(e.target.value) })}
                    className="w-full px-6 py-8 border-2 border-gray-700 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-black text-5xl text-center"
                    placeholder="90"
                    min="7"
                    max="365"
                  />
                  <p className="text-center text-gray-400 mt-4 font-medium">dias</p>
                  {tempProfile.goalDays && (
                    <div className="mt-6 p-4 bg-emerald-500/20 rounded-xl text-center border border-emerald-500/30">
                      <p className="text-emerald-400 font-bold text-lg">
                        Aproximadamente {Math.round(tempProfile.goalDays / 30)} meses 📅
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Passo 7: Nível de Atividade Física */}
            {onboardingStep === 6 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Dumbbell className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-black text-white mb-2">Qual é o seu nível de atividade física?</h2>
                  <p className="text-gray-400">Incluindo opções para treinar em casa</p>
                </div>
                <div className="space-y-3">
                  {[
                    { value: 'sedentary', label: 'Sedentário', desc: 'Pouco ou nenhum exercício', icon: '🛋️' },
                    { value: 'light', label: 'Levemente Ativo', desc: 'Exercícios leves 1-3 dias/semana ou caminhadas', icon: '🚶' },
                    { value: 'moderate', label: 'Moderadamente Ativo', desc: 'Exercícios moderados 3-5 dias/semana (treino em casa)', icon: '🏃' },
                    { value: 'active', label: 'Muito Ativo', desc: 'Exercícios intensos 6-7 dias/semana', icon: '💪' },
                    { value: 'very_active', label: 'Extremamente Ativo', desc: 'Exercícios muito intensos diariamente', icon: '🔥' }
                  ].map((activity) => (
                    <button
                      key={activity.value}
                      onClick={() => setTempProfile({ ...tempProfile, activityLevel: activity.value as UserProfile['activityLevel'] })}
                      className={`w-full p-5 rounded-2xl border-3 transition-all duration-300 text-left ${
                        tempProfile.activityLevel === activity.value
                          ? 'border-emerald-500 bg-emerald-500/20 shadow-xl scale-105'
                          : 'border-gray-700 hover:border-emerald-500/50 hover:shadow-lg bg-gray-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{activity.icon}</span>
                        <div className="flex-1">
                          <p className="font-bold text-white text-lg">{activity.label}</p>
                          <p className="text-sm text-gray-400">{activity.desc}</p>
                        </div>
                        {tempProfile.activityLevel === activity.value && (
                          <Check className="w-6 h-6 text-emerald-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Passo 8: Inspiração (Antes e Depois) */}
            {onboardingStep === 7 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Sparkles className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-black text-white mb-2">Você pode conseguir!</h2>
                  <p className="text-gray-400">Veja transformações reais de pessoas como você</p>
                </div>

                {/* Transformações */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Transformação Feminina */}
                  <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-2xl p-6 border-2 border-pink-700/30 backdrop-blur-sm">
                    <h3 className="font-bold text-white mb-4 text-center text-lg">Transformação Feminina</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="bg-gray-800/50 rounded-xl p-4 mb-2 shadow-lg">
                          <img 
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=faces" 
                            alt="Antes - Mulher" 
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <p className="font-bold text-gray-300">Antes</p>
                        <p className="text-sm text-gray-400">85 kg</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-gray-800/50 rounded-xl p-4 mb-2 shadow-lg">
                          <img 
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=faces" 
                            alt="Depois - Mulher Fitness" 
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <p className="font-bold text-emerald-400">Depois</p>
                        <p className="text-sm text-emerald-400">65 kg</p>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                      <p className="font-bold text-pink-400 text-2xl mb-1">-20 kg</p>
                      <p className="text-sm text-gray-400">em 6 meses</p>
                    </div>
                  </div>

                  {/* Transformação Masculina */}
                  <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-2xl p-6 border-2 border-blue-700/30 backdrop-blur-sm">
                    <h3 className="font-bold text-white mb-4 text-center text-lg">Transformação Masculina</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="bg-gray-800/50 rounded-xl p-4 mb-2 shadow-lg">
                          <img 
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=faces" 
                            alt="Antes - Homem" 
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <p className="font-bold text-gray-300">Antes</p>
                        <p className="text-sm text-gray-400">95 kg</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-gray-800/50 rounded-xl p-4 mb-2 shadow-lg">
                          <img 
                            src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=500&fit=crop&crop=faces" 
                            alt="Depois - Homem Fitness" 
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <p className="font-bold text-emerald-400">Depois</p>
                        <p className="text-sm text-emerald-400">78 kg</p>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                      <p className="font-bold text-blue-400 text-2xl mb-1">-17 kg</p>
                      <p className="text-sm text-gray-400">em 5 meses</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white text-center">
                  <p className="text-2xl font-black mb-2">Sua vez de brilhar! ✨</p>
                  <p className="text-emerald-100">Com dedicação e o ALY ao seu lado, você também pode alcançar seus objetivos</p>
                </div>
              </div>
            )}

            {/* Botões de Navegação */}
            <div className="flex gap-4 mt-8">
              {onboardingStep > 0 && (
                <button
                  onClick={() => setOnboardingStep(onboardingStep - 1)}
                  className="px-8 py-4 border-2 border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-all duration-300 font-bold"
                >
                  Voltar
                </button>
              )}
              {onboardingStep < 7 ? (
                <button
                  onClick={() => setOnboardingStep(onboardingStep + 1)}
                  disabled={
                    (onboardingStep === 0 && !tempProfile.gender) ||
                    (onboardingStep === 1 && (!tempProfile.age || !tempProfile.birthDate)) ||
                    (onboardingStep === 2 && !tempProfile.height) ||
                    (onboardingStep === 3 && !tempProfile.currentWeight) ||
                    (onboardingStep === 4 && !tempProfile.targetWeight) ||
                    (onboardingStep === 5 && !tempProfile.goalDays) ||
                    (onboardingStep === 6 && !tempProfile.activityLevel)
                  }
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center justify-center gap-2"
                >
                  Próximo
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={completeOnboarding}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-bold flex items-center justify-center gap-2"
                >
                  Começar Jornada
                  <Sparkles className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!todayLog || !userGoals) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-emerald-400 font-medium">Carregando ALY...</p>
        </div>
      </div>
    );
  }

  const waterProgress = (todayLog.water / userGoals.dailyWater) * 100;
  const caloriesProgress = (summary.totalCalories / userGoals.dailyCalories) * 100;
  const daysSinceStart = getDaysSinceStart();
  const goalEndDate = getGoalEndDate();

  // Calcular conquistas
  const achievements = [
    { 
      icon: '🔥', 
      name: 'Streak 7 dias', 
      unlocked: todayLog.meals.length >= 3,
      color: 'from-orange-400 to-red-500'
    },
    { 
      icon: '💧', 
      name: 'Hidratação Master', 
      unlocked: waterProgress >= 100,
      color: 'from-cyan-400 to-blue-500'
    },
    { 
      icon: '🥗', 
      name: 'Nutrição Balanceada', 
      unlocked: summary.totalProtein >= userGoals.dailyProtein * 0.8,
      color: 'from-green-400 to-emerald-500'
    },
    { 
      icon: '⚡', 
      name: 'Meta Diária', 
      unlocked: caloriesProgress >= 90 && caloriesProgress <= 110,
      color: 'from-yellow-400 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-xl">
                  <Apple className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  ALY
                </h1>
                <p className="text-xs text-gray-400 font-medium">Sua jornada saudável</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNutritionInfo(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
              >
                <Info className="w-5 h-5" />
                <span className="hidden sm:inline">Info Nutricional</span>
              </button>
              <button
                onClick={() => setShowGoalsModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
              >
                <Target className="w-5 h-5" />
                <span className="hidden sm:inline">Metas</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Banner de Início da Jornada com Data Final */}
        {userProfile?.startDate && (
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-2xl p-5 mb-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1">Início da Jornada</p>
                  <p className="text-sm font-black">
                    {new Date(userProfile.startDate).toLocaleDateString('pt-BR', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1">Dias de Progresso</p>
                  <p className="text-2xl font-black">{daysSinceStart} dias</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1">Meta até</p>
                  <p className="text-sm font-black">{goalEndDate}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dica do Dia */}
        <div className={`bg-gradient-to-r ${NUTRITION_TIPS[currentTip].color} rounded-2xl p-5 mb-6 shadow-xl transform transition-all duration-500`}>
          <div className="flex items-center gap-4 text-white">
            <div className="text-4xl animate-bounce">{NUTRITION_TIPS[currentTip].icon}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Dica de Nutrição
              </p>
              <p className="text-base font-medium">{NUTRITION_TIPS[currentTip].tip}</p>
            </div>
          </div>
        </div>

        {/* Data e Conquistas */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white capitalize flex items-center gap-2">
              <Calendar className="w-6 h-6 text-emerald-400" />
              {formatDate(todayLog.date)}
            </h2>
          </div>
          <div className="flex gap-2">
            {achievements.map((achievement, idx) => (
              <div
                key={idx}
                className={`relative group ${achievement.unlocked ? 'scale-100' : 'scale-90 opacity-50'} transition-all duration-300`}
              >
                <div className={`text-2xl p-2 bg-gradient-to-br ${achievement.color} rounded-xl shadow-lg ${achievement.unlocked ? 'animate-pulse' : ''}`}>
                  {achievement.icon}
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {achievement.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cards de Resumo Nutricional Detalhado */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Calorias */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 shadow-xl border-2 border-orange-900/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 p-3 rounded-xl">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-orange-400 uppercase tracking-wide">Calorias</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">
                  {summary.totalCalories}
                </span>
                <span className="text-sm text-gray-400 font-medium">/ {userGoals.dailyCalories}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-orange-400 to-orange-600 h-2.5 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${Math.min(caloriesProgress, 100)}%` }}
                />
              </div>
              <p className="text-xs font-semibold">
                {summary.caloriesRemaining > 0 ? (
                  <span className="text-emerald-400">Restam {summary.caloriesRemaining} kcal</span>
                ) : (
                  <span className="text-orange-400">Meta atingida! 🎉</span>
                )}
              </p>
            </div>
          </div>

          {/* Proteína */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 shadow-xl border-2 border-red-900/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-red-900/50 to-red-800/50 p-3 rounded-xl">
                <Activity className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-red-400 uppercase tracking-wide">Proteína</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">
                  {summary.totalProtein}g
                </span>
                <span className="text-sm text-gray-400 font-medium">/ {userGoals.dailyProtein}g</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-red-400 to-red-600 h-2.5 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${Math.min((summary.totalProtein / userGoals.dailyProtein) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs font-semibold text-gray-400">
                Essencial para músculos
              </p>
            </div>
          </div>

          {/* Carboidratos */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 shadow-xl border-2 border-yellow-900/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 p-3 rounded-xl">
                <Utensils className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-yellow-400 uppercase tracking-wide">Carboidratos</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">
                  {summary.totalCarbs}g
                </span>
                <span className="text-sm text-gray-400 font-medium">/ {userGoals.dailyCarbs}g</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2.5 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${Math.min((summary.totalCarbs / userGoals.dailyCarbs) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs font-semibold text-gray-400">
                Fonte de energia
              </p>
            </div>
          </div>

          {/* Gorduras */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 shadow-xl border-2 border-purple-900/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-purple-400 uppercase tracking-wide">Gorduras</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">
                  {summary.totalFat}g
                </span>
                <span className="text-sm text-gray-400 font-medium">/ {userGoals.dailyFat}g</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-2.5 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${Math.min((summary.totalFat / userGoals.dailyFat) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs font-semibold text-gray-400">
                Gorduras saudáveis
              </p>
            </div>
          </div>
        </div>

        {/* Água */}
        <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl border-2 border-cyan-700/30 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <Droplet className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Hidratação</h3>
                <p className="text-sm text-gray-300 font-medium">
                  {todayLog.water}ml / {userGoals.dailyWater}ml
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-cyan-400">{Math.round(waterProgress)}%</p>
              <p className="text-xs text-gray-400">Completo</p>
            </div>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-4 mb-4 shadow-inner">
            <div
              className="bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500 shadow-lg relative overflow-hidden"
              style={{ width: `${Math.min(waterProgress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[250, 500, 750, 1000].map((amount) => (
              <button
                key={amount}
                onClick={() => handleAddWater(amount)}
                className="flex-1 min-w-[100px] px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold text-sm"
              >
                + {amount}ml
              </button>
            ))}
          </div>
        </div>

        {/* Tabs de Navegação */}
        <div className="flex gap-2 mb-6 bg-gray-800/50 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg scale-105'
                : 'text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="hidden sm:inline">Visão Geral</span>
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap ${
              activeTab === 'exercises'
                ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg scale-105'
                : 'text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            <Dumbbell className="w-5 h-5" />
            <span className="hidden sm:inline">Exercícios</span>
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap ${
              activeTab === 'recipes'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-105'
                : 'text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            <ChefHat className="w-5 h-5" />
            <span className="hidden sm:inline">Receitas</span>
          </button>
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap ${
              activeTab === 'quick'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg scale-105'
                : 'text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="hidden sm:inline">Rápido</span>
          </button>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'overview' && (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border-2 border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <Utensils className="w-6 h-6 text-emerald-400" />
                Refeições de Hoje
              </h3>
              <button
                onClick={() => setShowAddMeal(true)}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Adicionar</span>
              </button>
            </div>

            {todayLog.meals.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Utensils className="w-10 h-10 text-emerald-400" />
                </div>
                <p className="text-gray-300 font-semibold mb-2 text-lg">Nenhuma refeição registrada hoje</p>
                <p className="text-sm text-gray-400">Comece adicionando sua primeira refeição!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayLog.meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border-2 border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-gray-800 p-3 rounded-xl shadow-md">
                        {getMealIcon(meal.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-white truncate text-lg">{meal.name}</h4>
                          <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {meal.time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2 font-medium">{getMealLabel(meal.type)}</p>
                        <div className="flex flex-wrap gap-3 text-xs font-bold">
                          <span className="px-2 py-1 bg-orange-900/30 text-orange-400 rounded-lg border border-orange-700/30">{meal.calories} kcal</span>
                          <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded-lg border border-red-700/30">P: {meal.protein}g</span>
                          <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded-lg border border-yellow-700/30">C: {meal.carbs}g</span>
                          <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded-lg border border-purple-700/30">G: {meal.fat}g</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMeal(meal.id)}
                      className="ml-2 p-2 text-red-400 hover:bg-red-900/30 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'exercises' && (
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                <Dumbbell className="w-7 h-7 text-red-400" />
                Exercícios para Fazer em Casa
              </h3>
              <p className="text-gray-400">Clique para ver instruções detalhadas</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {HOME_EXERCISES.map((exercise) => (
                <div
                  key={exercise.id}
                  onClick={() => setShowExerciseDetail(exercise)}
                  className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 shadow-xl border-2 border-gray-700 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <div className={`bg-gradient-to-br ${exercise.color} rounded-xl p-4 mb-4 text-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-5xl">{exercise.emoji}</span>
                  </div>
                  <h4 className="font-bold text-white mb-2 text-lg">{exercise.name}</h4>
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <span className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-lg font-medium">
                      {exercise.category}
                    </span>
                    <span className={`px-2 py-1 rounded-lg font-medium ${
                      exercise.difficulty === 'Fácil' ? 'bg-green-900/30 text-green-400 border border-green-700/30' :
                      exercise.difficulty === 'Médio' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/30' :
                      'bg-red-900/30 text-red-400 border border-red-700/30'
                    }`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{exercise.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-orange-400 font-bold">
                      <Flame className="w-4 h-4" />
                      <span>~{exercise.calories} kcal queimadas</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300">
                    Ver Instruções
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                <ChefHat className="w-7 h-7 text-orange-400" />
                Receitas Saudáveis
              </h3>
              <p className="text-gray-400">Clique para adicionar ao seu diário</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {RECIPES.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => handleAddRecipe(recipe)}
                  className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 shadow-xl border-2 border-gray-700 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <div className={`bg-gradient-to-br ${recipe.color} rounded-xl p-4 mb-4 text-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-5xl">{recipe.emoji}</span>
                  </div>
                  <h4 className="font-bold text-white mb-2 text-lg">{recipe.name}</h4>
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1 bg-gray-700/50 px-2 py-1 rounded-lg">
                      <Clock className="w-3 h-3" />
                      {recipe.time}
                    </span>
                    <span className="bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded-lg font-medium border border-emerald-700/30">
                      {recipe.difficulty}
                    </span>
                  </div>
                  
                  {/* Informações Nutricionais Detalhadas */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold mb-3">
                    <span className="px-2 py-1 bg-orange-900/30 text-orange-400 rounded-lg text-center border border-orange-700/30">{recipe.calories} kcal</span>
                    <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded-lg text-center border border-red-700/30">P: {recipe.protein}g</span>
                    <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded-lg text-center border border-yellow-700/30">C: {recipe.carbs}g</span>
                    <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded-lg text-center border border-purple-700/30">G: {recipe.fat}g</span>
                    <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-lg text-center border border-green-700/30">Fibra: {recipe.fiber}g</span>
                    <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded-lg text-center border border-blue-700/30">Sódio: {recipe.sodium}mg</span>
                  </div>

                  {/* Ingredientes */}
                  <div className="mb-3 p-2 bg-gray-700/30 rounded-lg border border-gray-600/30">
                    <p className="text-xs font-bold text-gray-300 mb-1">Ingredientes:</p>
                    <p className="text-xs text-gray-400">{recipe.ingredients.join(', ')}</p>
                  </div>

                  <button className="w-full mt-2 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300">
                    Adicionar ao Diário
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'quick' && (
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                <Zap className="w-7 h-7 text-purple-400" />
                Alimentos Rápidos
              </h3>
              <p className="text-gray-400">Adicione com um clique</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {QUICK_FOODS.map((food, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAddQuickFood(food)}
                  className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 shadow-xl border-2 border-gray-700 hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer text-center group"
                >
                  <div className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">
                    {food.emoji}
                  </div>
                  <h4 className="font-bold text-white mb-2 text-sm">{food.name}</h4>
                  <div className="space-y-1 text-xs font-bold">
                    <p className="text-orange-400">{food.calories} kcal</p>
                    <div className="flex justify-center gap-2">
                      <span className="text-red-400">P:{food.protein}</span>
                      <span className="text-yellow-400">C:{food.carbs}</span>
                      <span className="text-purple-400">G:{food.fat}</span>
                    </div>
                    <div className="flex justify-center gap-2 text-[10px]">
                      <span className="text-green-400">Fibra:{food.fiber}g</span>
                      <span className="text-pink-400">Açúcar:{food.sugar}g</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal Detalhes do Exercício */}
      {showExerciseDetail && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-gray-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border-2 border-gray-700 my-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`bg-gradient-to-br ${showExerciseDetail.color} rounded-2xl p-4 shadow-lg`}>
                  <span className="text-5xl">{showExerciseDetail.emoji}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">{showExerciseDetail.name}</h3>
                  <p className="text-gray-400">{showExerciseDetail.category}</p>
                </div>
              </div>
              <button
                onClick={() => setShowExerciseDetail(null)}
                className="p-2 hover:bg-gray-700 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Info Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">Dificuldade</p>
                  <p className={`font-bold ${
                    showExerciseDetail.difficulty === 'Fácil' ? 'text-green-400' :
                    showExerciseDetail.difficulty === 'Médio' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>{showExerciseDetail.difficulty}</p>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">Duração</p>
                  <p className="font-bold text-white text-sm">{showExerciseDetail.duration}</p>
                </div>
                <div className="bg-orange-900/30 rounded-xl p-3 text-center border border-orange-700/30">
                  <p className="text-xs text-orange-400 mb-1">Calorias</p>
                  <p className="font-bold text-orange-400">~{showExerciseDetail.calories} kcal</p>
                </div>
              </div>

              {/* Músculos Trabalhados */}
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Músculos Trabalhados
                </h4>
                <div className="flex flex-wrap gap-2">
                  {showExerciseDetail.muscles.map((muscle, idx) => (
                    <span key={idx} className="px-3 py-1 bg-emerald-900/30 text-emerald-400 rounded-lg text-sm font-medium border border-emerald-700/30">
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instruções */}
              <div>
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  Como Executar
                </h4>
                <ol className="space-y-3">
                  {showExerciseDetail.instructions.map((instruction, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-gray-300 flex-1">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Dicas */}
              <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-4 border-2 border-yellow-700/30">
                <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Dica Importante
                </h4>
                <p className="text-gray-300 text-sm">{showExerciseDetail.tips}</p>
              </div>
            </div>

            <button
              onClick={() => setShowExerciseDetail(null)}
              className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-bold"
            >
              Entendi! Vou Praticar
            </button>
          </div>
        </div>
      )}

      {/* Modal Informações Nutricionais */}
      {showNutritionInfo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-gray-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto border-2 border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-400" />
                Guia Nutricional Completo
              </h3>
              <button
                onClick={() => setShowNutritionInfo(false)}
                className="p-2 hover:bg-gray-700 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Macronutrientes */}
              <div>
                <h4 className="font-bold text-lg text-white mb-3 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  Macronutrientes
                </h4>
                <div className="space-y-3">
                  <div className="p-4 bg-orange-900/20 rounded-xl border-2 border-orange-700/30">
                    <p className="font-bold text-orange-400 mb-1">🔥 Calorias (kcal)</p>
                    <p className="text-sm text-gray-300">Energia que seu corpo precisa para funcionar. Controle para manter, perder ou ganhar peso.</p>
                  </div>
                  <div className="p-4 bg-red-900/20 rounded-xl border-2 border-red-700/30">
                    <p className="font-bold text-red-400 mb-1">💪 Proteínas (g)</p>
                    <p className="text-sm text-gray-300">Constroem e reparam músculos. Essenciais para recuperação e saciedade. Fontes: carnes, ovos, leguminosas.</p>
                  </div>
                  <div className="p-4 bg-yellow-900/20 rounded-xl border-2 border-yellow-700/30">
                    <p className="font-bold text-yellow-400 mb-1">⚡ Carboidratos (g)</p>
                    <p className="text-sm text-gray-300">Principal fonte de energia. Prefira integrais (arroz, pão integral, batata doce) para energia sustentada.</p>
                  </div>
                  <div className="p-4 bg-purple-900/20 rounded-xl border-2 border-purple-700/30">
                    <p className="font-bold text-purple-400 mb-1">🥑 Gorduras (g)</p>
                    <p className="text-sm text-gray-300">Essenciais para hormônios e absorção de vitaminas. Prefira fontes saudáveis: azeite, abacate, castanhas.</p>
                  </div>
                </div>
              </div>

              {/* Micronutrientes */}
              <div>
                <h4 className="font-bold text-lg text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-400" />
                  Micronutrientes Importantes
                </h4>
                <div className="space-y-3">
                  <div className="p-4 bg-green-900/20 rounded-xl border-2 border-green-700/30">
                    <p className="font-bold text-green-400 mb-1">🌾 Fibras (g)</p>
                    <p className="text-sm text-gray-300">Melhoram digestão e saciedade. Meta: 25-30g/dia. Fontes: frutas, vegetais, grãos integrais.</p>
                  </div>
                  <div className="p-4 bg-blue-900/20 rounded-xl border-2 border-blue-700/30">
                    <p className="font-bold text-blue-400 mb-1">🧂 Sódio (mg)</p>
                    <p className="text-sm text-gray-300">Controle para saúde cardiovascular. Limite: 2000mg/dia. Evite alimentos processados.</p>
                  </div>
                  <div className="p-4 bg-pink-900/20 rounded-xl border-2 border-pink-700/30">
                    <p className="font-bold text-pink-400 mb-1">🍬 Açúcares (g)</p>
                    <p className="text-sm text-gray-300">Limite açúcares adicionados. Prefira açúcares naturais de frutas. Máximo: 25-50g/dia.</p>
                  </div>
                </div>
              </div>

              {/* Dicas Práticas */}
              <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl text-white">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Dicas para Sucesso
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Beba 2-3 litros de água por dia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Coma devagar e mastigue bem</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Prefira alimentos naturais e minimamente processados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Faça 5-6 refeições pequenas ao dia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Durma 7-9 horas por noite</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowNutritionInfo(false)}
              className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-bold"
            >
              Entendi!
            </button>
          </div>
        </div>
      )}

      {/* Modal Adicionar Refeição */}
      {showAddMeal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-gray-700">
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-emerald-400" />
              Adicionar Refeição
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Nome da Refeição
                </label>
                <input
                  type="text"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                  placeholder="Ex: Omelete com queijo"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Tipo de Refeição
                </label>
                <select
                  value={newMeal.type}
                  onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value as Meal['type'] })}
                  className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                >
                  <option value="breakfast">Café da Manhã</option>
                  <option value="lunch">Almoço</option>
                  <option value="dinner">Jantar</option>
                  <option value="snack">Lanche</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Calorias (kcal)
                  </label>
                  <input
                    type="number"
                    value={newMeal.calories}
                    onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Proteína (g)
                  </label>
                  <input
                    type="number"
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Carboidratos (g)
                  </label>
                  <input
                    type="number"
                    value={newMeal.carbs}
                    onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Gorduras (g)
                  </label>
                  <input
                    type="number"
                    value={newMeal.fat}
                    onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAddMeal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-700 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddMeal}
                disabled={!newMeal.name || !newMeal.calories}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Metas */}
      {showGoalsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-gray-700">
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-emerald-400" />
              Minhas Metas Diárias
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Calorias (kcal)
                </label>
                <input
                  type="number"
                  defaultValue={userGoals.dailyCalories}
                  onChange={(e) => handleUpdateGoals({ dailyCalories: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Proteína (g)
                </label>
                <input
                  type="number"
                  defaultValue={userGoals.dailyProtein}
                  onChange={(e) => handleUpdateGoals({ dailyProtein: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Carboidratos (g)
                </label>
                <input
                  type="number"
                  defaultValue={userGoals.dailyCarbs}
                  onChange={(e) => handleUpdateGoals({ dailyCarbs: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Gorduras (g)
                </label>
                <input
                  type="number"
                  defaultValue={userGoals.dailyFat}
                  onChange={(e) => handleUpdateGoals({ dailyFat: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Água (ml)
                </label>
                <input
                  type="number"
                  defaultValue={userGoals.dailyWater}
                  onChange={(e) => handleUpdateGoals({ dailyWater: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            <button
              onClick={() => setShowGoalsModal(false)}
              className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-bold flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Salvar Metas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
