import * as conbo from 'conbo';

export default class StateHistory extends conbo.EventDispatcher
{
	/**
	 * @private
	 */
	construct(target:conbo.EventDispatcher);

	/**
	 * The current cursor index
	 */
	currentIndex:number;

	/**
	 * The number of items stored in history
	 */
	readonly length:number;

	/**
	 * Is the cursor at a point before history began?
	 */
	readonly beforeFirst:boolean;

	/**
	 * Is the cursor at the end of history
	 */
	readonly atLast:boolean;

	/**
	 * Go back 1 step into history
	 */
	back():StateHistory;

	/**
	 * Move forward 1 step in history
	 */
	forward():StateHistory;

	/**
	 * Move an arbitrary number of steps forward or backward in history
	 * @param		{number} n - The number of steps to move back or forward in history
	 */
	go(n:number):StateHistory;

	/**
	 * Encodes values as they're added to history (can be overriden)
	 * @returns		{any}	Value to be added to history
	 */
	encodeFunction(value:any):any

	/**
	 * Encodes values as they're taken out of history (can be overriden)
	 * @returns		{any}	Value to be be applied to the target
	 */
	decodeFunction(value:any):any;
}
