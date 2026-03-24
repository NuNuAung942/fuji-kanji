import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import week1Data from '../../data/n3_week1.json';
import week2Data from '../../data/n3_week2.json';
import week3Data from '../../data/n3_week3.json';
import week4Data from '../../data/n3_week4.json';
import type { RootState } from '../../app/store';

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
}

const initialState: KanjiState = {
  weeks: [
    week1Data as unknown as Week,
    week2Data as unknown as Week,
    week3Data as unknown as Week,
    week4Data as unknown as Week,
  ],
  selectedWeek: 1,
  selectedDay: 1,
  currentIndex: 0,
  isFlipped: false,
};

export const kanjiSlice = createSlice({
  name: 'kanji',
  initialState,
  reducers: {
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
      state.weeks.push(action.payload);
    }
  },
});

export const selectCurrentKanjiList = (state: RootState) => {
  const week = state.kanji.weeks.find(w => w.week === state.kanji.selectedWeek);
  const day = week?.days.find(d => d.day === state.kanji.selectedDay);
  return day?.kanji_list || [];
};

export const { setWeek,setDay, previousCard, nextCard, toggleFlip, addWeekData } = kanjiSlice.actions;
export default kanjiSlice.reducer;