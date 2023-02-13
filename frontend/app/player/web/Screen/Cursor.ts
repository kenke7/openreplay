import type { Point } from './types';
import styles from './cursor.module.css';


export default class Cursor {
  private readonly isMobile: boolean;
  private readonly cursor: HTMLDivElement;
  private tagElement: HTMLDivElement;
  private coords = { x: 0, y: 0 };
  private isMoving = false;

  constructor(overlay: HTMLDivElement, isMobile: boolean) {
    this.cursor = document.createElement('div');
    this.cursor.className = styles.cursor;
    if (isMobile) this.cursor.style.backgroundImage = 'unset'
    overlay.appendChild(this.cursor);
    this.isMobile = isMobile;

    window.shakeTest = this.shake.bind(this);
  }

  toggle(flag: boolean) {
    if (flag) {
      this.cursor.style.display = 'block';
    } else {
      this.cursor.style.display = 'none';
    }
  }

  showTag(tag?: string) {
    if (!this.tagElement) {
      this.tagElement = document.createElement('div')
      Object.assign(this.tagElement.style, {
        position: 'absolute',
        padding: '4px 6px',
        borderRadius: '8px',
        backgroundColor: '#3EAAAF',
        color: 'white',
        bottom: '-25px',
        left: '80%',
        fontSize: '12px',
        whiteSpace: 'nowrap',
      })
      this.cursor.appendChild(this.tagElement)
    }

    if (!tag) {
      this.tagElement.style.display = 'none'
    } else {
      this.tagElement.style.display = 'block'
      const nameStr = tag.length > 10 ? tag.slice(0, 9) + '...' : tag
      this.tagElement.innerHTML = `<span>${nameStr}</span>`
    }
  }

  move({ x, y }: Point) {
    this.isMoving = true;
    this.cursor.style.left = x + 'px';
    this.cursor.style.top = y + 'px';
    this.coords = { x, y };
    setTimeout(() => this.isMoving = false, 60)
  }

  shake(iteration = 1, upwards = true, original: { x: number, y: number } = this.coords) {
    if (this.isMoving) return;
    if (iteration < 10) {
      this.cursor.style.width = 45 + 'px'
      this.cursor.style.height = 75 + 'px'
      const shift = upwards ? 60 : -60
      this.move({ x: this.coords.x + shift, y: this.coords.y - shift })
      setTimeout(() => this.shake(iteration + 1, !upwards, original), 60)
    } else {
      this.cursor.style.width = 18 + 'px'
      this.cursor.style.height = 30 + 'px'

      this.move(original)
    }
  }

  click() {
    const styleList = this.isMobile ? styles.clickedMobile : styles.clicked
    this.cursor.classList.add(styleList)
    setTimeout(() => {
      this.cursor.classList.remove(styleList)
    }, 600)
  }

  // TODO (to keep on a different playig speed):
  // transition
  // setTransitionSpeed()

}
