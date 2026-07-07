import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Compound {
  kanji: string;
  reading: string;
  meaning_mm: string;
}

export interface Kanji {
  id: number;
  kanji: string;
  meaning_en: string;
  meaning_mm: string;
  onyomi: string;
  kunyomi: string;
  compounds: Compound[];
}

interface Day {
  day: number;
  day_title: string;
  kanji_list: Kanji[];
}

interface Week {
  week: number;
  week_title: string;
  days: Day[];
}

interface KanjiState {
  weeks: Week[];
  selectedWeek: number;
  selectedDay: number;
  currentIndex: number;
  isFlipped: boolean;
  currentLevel: number | null;
}

const initialState: KanjiState = {
  weeks: [],
  selectedWeek: 1,
  selectedDay: 1,
  currentIndex: 0,
  isFlipped: false,
  currentLevel: null,
};

export const kanjiSlice = createSlice({
  name: 'kanji',
  initialState,
  reducers: {
    setLevelData: (state, action: PayloadAction<{ selectedLevel: number; weeks: Week[] }>) => {
      state.currentLevel = action.payload.selectedLevel;
      state.weeks = action.payload.weeks;
      state.selectedWeek = 1;
      state.selectedDay = 1;
      state.currentIndex = 0;
      state.isFlipped = false;
    },
    setWeek: (state, action: PayloadAction<number>) => {
      state.selectedWeek = action.payload;
      state.selectedDay = 1;  
      state.currentIndex = 0; 
      state.isFlipped = false;
    },
    setDay: (state, action: PayloadAction<number>) => {
      state.selectedDay = action.payload;
      state.currentIndex = 0; 
      state.isFlipped = false;
    },
    
    previousCard: (state) => {
        const currentWeek = state.weeks.find(w => w.week === state.selectedWeek);
        const currentDay = currentWeek?.days.find(d => d.day === state.selectedDay);
        const listLength = currentDay?.kanji_list.length || 0;
        
        if (listLength > 0) {
           state.currentIndex = (state.currentIndex - 1 + listLength) % listLength;
        }
        state.isFlipped = false;
    },
    nextCard: (state) => {
      const currentWeek = state.weeks.find(w => w.week === state.selectedWeek);
      const currentDay = currentWeek?.days.find(d => d.day === state.selectedDay);
      const listLength = currentDay?.kanji_list.length || 0;
      
      if (listLength > 0) {
        state.currentIndex = (state.currentIndex + 1) % listLength;
      }
      state.isFlipped = false;
    },

    toggleFlip: (state) => {
      state.isFlipped = !state.isFlipped;
    },
    addWeekData: (state, action: PayloadAction<Week>) => {
      const exists = state.weeks.find(w => w.week === action.payload.week);
      if (!exists) {
        state.weeks.push(action.payload);
      }
    }
  },
});

export const { setWeek,setDay, previousCard, nextCard, toggleFlip, addWeekData,setLevelData } = kanjiSlice.actions;
export default kanjiSlice.reducer;