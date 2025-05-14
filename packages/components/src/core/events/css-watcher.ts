import { animationFrameScheduler, merge, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, throttleTime } from 'rxjs/operators';

import { DestroyRef, inject, Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CssMonitor {
  private _destroyRef = inject(DestroyRef);

  private _ngZone = inject(NgZone);

  // 监听 CSS 变量变化（支持全局或特定元素）
  watchCssVariable(varName: string, element: HTMLElement = document.documentElement): Observable<string> {
    return new Observable<string>(subscriber => {
      // 获取当前值
      const currentValue = getComputedStyle(element).getPropertyValue(varName).trim();

      // 创建 MutationObserver
      const observer = new MutationObserver(mutations => {
        const newValue = getComputedStyle(element).getPropertyValue(varName).trim();
        if (newValue !== currentValue) {
          this._ngZone.run(() => subscriber.next(newValue)); // 确保在 Angular 上下文触发
        }

        console.log(newValue);
      });

      // 开始监听
      observer.observe(element, {
        attributes: true,
        attributeFilter: ['style'], // 仅监听内联样式变化
      });

      // 清理逻辑
      return () => observer.disconnect();
    });
  }

  // 核心方法：监听元素所有 CSS 变化
  watchAllCssChanges(element: HTMLElement): Observable<{ [key: string]: string }> {
    return merge(this.watchInlineStyleChanges(element), this.watchClassChanges(element)).pipe(
      throttleTime(16, animationFrameScheduler, { leading: true, trailing: true }), // 60fps 节流
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    );
  }

  // 监听内联样式变化
  private watchInlineStyleChanges(element: HTMLElement): Observable<{ [key: string]: string }> {
    return this.createMutationObserver(element, ['style']).pipe(map(() => this.getCurrentStyles(element)));
  }

  // 监听类名变化（可能影响 CSS）
  private watchClassChanges(element: HTMLElement): Observable<{ [key: string]: string }> {
    return this.createMutationObserver(element, ['class']).pipe(map(() => this.getCurrentStyles(element)));
  }

  // 工具方法：创建 MutationObserver 的 Observable
  private createMutationObserver(element: HTMLElement, attributes: string[]): Observable<void> {
    return new Observable<void>(subscriber => {
      const observer = new MutationObserver(() => {
        this._ngZone.run(() => subscriber.next());
      });

      observer.observe(element, {
        attributes: true,
        attributeFilter: attributes,
        attributeOldValue: true,
      });

      return () => observer.disconnect();
    }).pipe(
      startWith(null), // 立即触发初始检测
      switchMap(() => this._ngZone.onStable), // 等待 Angular 稳定状态
    );
  }

  // 获取当前所有计算样式（优化版）
  private getCurrentStyles(element: HTMLElement): { [key: string]: string } {
    const styles = getComputedStyle(element);
    const result: { [key: string]: string } = {};

    // 只遍历有效 CSS 属性（跳过空值和数字键）
    for (let i = 0; i < styles.length; i++) {
      const key = styles[i];
      if (/^[a-zA-Z-]+$/.test(key)) {
        result[key] = styles.getPropertyValue(key).trim();
      }
    }

    return result;
  }

  // 浅比较对象是否相等
  private shallowEqual(a: any, b: any): boolean {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;

    return aKeys.every(key => a[key] === b[key]);
  }
}
