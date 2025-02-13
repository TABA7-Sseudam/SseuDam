declare module 'react-calendar' {
    import * as React from 'react';
  
    export interface CalendarProps {
      onChange?: (value: Date | Date[] | null) => void;
      value?: Date | Date[] | null;
      calendarType?: string;
      className?: string;
    }
  
    const Calendar: React.FC<CalendarProps>;
  
    export default Calendar;
  }
  