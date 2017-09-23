conbo.StateHistory = conbo.EventDispatcher.extend(
/** @lends conbo.StateManager.prototype */
{
	/**
	 * @private
	 */
	__construct: function(target)
	{
		if (!conbo.is(target, conbo.EventDispatcher))
		{
			throw new Error('target must extend EventDispatcher');
		}

		target.addEventListener(conbo.Event.CHANGE, this.__changeHandler, this);

		this.__currentIndex = -1;
		this.__history = [];
		this.__target = target;
	},

	/**
	 * @private
	 */
	__changeHandler: function(event)
	{
		this.__history.splice(this.__currentIndex+1);

		this.__history.push
		({
			property: event.property,
			value: this.encodeFunction(event.value)
		});

		this.__currentIndex = this.length-1;
		this.dispatchChange('length', 'currentIndex');
	},

	/**
	 * @type	{number} The current cursor index
	 */
	get currentIndex()
	{
		return this.__currentIndex;
	},

	set currentIndex(value)
	{
		if (value === this.__currentIndex) return;

		var h;

		value = Math.max(-1, Math.min(value, this.length-1));

		while (value < this.__currentIndex)
		{
			h = this.__history[--this.__currentIndex];
			this.__target[h.property] = this.decodeFunction(h.value);
		} 

		while (value > this.__currentIndex)
		{
			h = this.__history[++this.__currentIndex];
			this.__target[h.property] = this.decodeFunction(h.value);
		}

		this.dispatchChange('currentIndex', 'beforeFirst', 'atLast');
	},

	/**
	 * @type	{number} The number of items stored in history
	 */
	get length()
	{
		return this.__history.length;
	},

	/**
	 * @type	{boolean} Is the cursor at a point before history began?
	 */
	get beforeFirst()
	{
		return this.__currentIndex === -1;
	},

	/**
	 * @type	{boolean} Is the cursor at the end of history
	 */
	get atLast()
	{
		return this.__currentIndex+1 === this.length;
	},

	/**
	 * Go back 1 step into history
	 * @returns		{conbo.StateHistory}
	 */
	back: function()
	{
		--this.currentIndex;
		return this;
	},

	/**
	 * Move forward 1 step in history
	 * @returns		{conbo.StateHistory}
	 */
	forward: function()
	{
		++this.currentIndex;
		return this;
	},

	/**
	 * Move an arbitrary number of steps forward or backward in history
	 * @param		{number} n - The number of steps to move back or forward in history
	 * @returns		{conbo.StateHistory}
	 */
	go: function(n)
	{
		this.currentIndex += n;
		return this;
	},

	/**
	 * Encodes values as they're added to history (can be overriden)
	 * @returns		{*}	Value to be added to history
	 */
	encodeFunction: function(value)
	{
		if (Array.isArray(value)) return value.slice();
		return value;
	},

	/**
	 * Encodes values as they're taken out of history (can be overriden)
	 * @returns		{*}	Value to be be applied to the target
	 */
	decodeFunction: function(value)
	{
		return value;
	},

});
