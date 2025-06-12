import { Component, computed, Input, signal } from '@angular/core';

@Component({
  selector: 'app-exercise1',
  standalone: true,
  imports: [],
  templateUrl: './exercise1.component.html',
  styleUrl: './exercise1.component.css'
})
export class Exercise1Component {
  title = 'Chest Fly Machine';
  description = 'Isolates And Tones The Chest Muscles.';
  duration = 120; // 2 minutes in seconds

  // Signals for reactive state management
  private _isActive = signal(false);
  private _isRunning = signal(false);
  private _timeRemaining = signal(120);
  private intervalId: number | null = null;

  // Computed properties using signals
  isActive = this._isActive.asReadonly();
  isRunning = this._isRunning.asReadonly();
  timeRemaining = this._timeRemaining.asReadonly();

  progressPercentage = computed(() => {
    const remaining = this._timeRemaining();
    return ((this.duration - remaining) / this.duration) * 100;
  });

  formattedTime = computed(() => {
    const seconds = this._timeRemaining();
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  });

  isCompleted = computed(() => this._timeRemaining() === 0);

  ngOnInit() {
    this._timeRemaining.set(this.duration);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  selectExercise() {
    if (!this._isActive()) {
      this._isActive.set(true);
      this._timeRemaining.set(this.duration);
    }
  }

  toggleTimer(event: Event) {
    event.stopPropagation();

    if (this._timeRemaining() === 0) {
      return;
    }

    if (this._isRunning()) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this._isRunning.set(true);
    this.intervalId = window.setInterval(() => {
      const current = this._timeRemaining();
      if (current > 0) {
        this._timeRemaining.set(current - 1);
      } else {
        this.completeExercise();
      }
    }, 1000);
  }

  pauseTimer() {
    this._isRunning.set(false);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  resetTimer(event: Event) {
    event.stopPropagation();
    this.pauseTimer();
    this._timeRemaining.set(this.duration);
  }

  private completeExercise() {
    this._isRunning.set(false);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    // You can add completion logic here (e.g., emit event, show notification)
    console.log('Exercise completed!');
  }


}
