import type { GridNode } from './types';

/**
 * MinHeap implementation for optimal priority queue operations in Dijkstra and A* algorithms.
 */
export class MinHeap {
  private heap: GridNode[] = [];

  /**
   * Get the current elements in the heap as an array copy.
   */
  public getElements(): GridNode[] {
    return [...this.heap];
  }

  public size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public insert(node: GridNode): void {
    this.heap.push(node);
    this.heapifyUp(this.heap.length - 1);
  }

  public extractMin(): GridNode | null {
    if (this.isEmpty()) return null;
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0 && end !== undefined) {
      this.heap[0] = end;
      this.heapifyDown(0);
    }
    return min;
  }

  private heapifyUp(index: number): void {
    let currentIndex = index;
    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      if (this.compare(this.heap[currentIndex], this.heap[parentIndex]) >= 0) {
        break;
      }
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
    }
  }

  private heapifyDown(index: number): void {
    let currentIndex = index;
    const length = this.heap.length;
    while (true) {
      const leftChildIndex = 2 * currentIndex + 1;
      const rightChildIndex = 2 * currentIndex + 2;
      let smallestIndex = currentIndex;

      if (
        leftChildIndex < length &&
        this.compare(this.heap[leftChildIndex], this.heap[smallestIndex]) < 0
      ) {
        smallestIndex = leftChildIndex;
      }

      if (
        rightChildIndex < length &&
        this.compare(this.heap[rightChildIndex], this.heap[smallestIndex]) < 0
      ) {
        smallestIndex = rightChildIndex;
      }

      if (smallestIndex === currentIndex) {
        break;
      }

      this.swap(currentIndex, smallestIndex);
      currentIndex = smallestIndex;
    }
  }

  private compare(a: GridNode, b: GridNode): number {
    // Primary key: totalDistance (f-score). Secondary key: heuristicDistance (h-score).
    const aVal = a.totalDistance !== Infinity ? a.totalDistance : a.distance;
    const bVal = b.totalDistance !== Infinity ? b.totalDistance : b.distance;

    if (aVal === bVal) {
      return a.heuristicDistance - b.heuristicDistance;
    }
    return aVal - bVal;
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}
