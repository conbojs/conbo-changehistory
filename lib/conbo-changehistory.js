(function(window, factory)
{
	if (typeof define === 'function' && define.amd) 
	{
		define('conbo-statehistory', ['conbo'], factory);
	}
	else if (typeof module !== 'undefined' && module.exports)
	{
		module.exports = factory(require('conbo'));
	}
	else
	{
		window.ChangeHistory = factory(window.conbo);
	}
}
(this, function(conbo)
{
	/**
	 * State history manager class for ConboJS 4
	 * @author	Neil Rackett
	 * @class	ChangeHistory
	 * @param	{conbo.EventDispatcher} target - The target object
	 */
	return conbo.EventDispatcher.extend(
	/** @lends ChangeHistory.prototype */
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
	
			this.__currentIndex = -1;
			this.__history = [];
			this.__target = target;
			this.__originalValues = {};

			var keys = Object.keys(target);
			
			while (keys.length)
			{
				var key = keys.pop();
				this.__originalValues[key] = target[key];
			}

			this.bindAll('back', 'forward', 'go');

			target.addEventListener(conbo.ConboEvent.CHANGE, this.__changeHandler, this);
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
				oldValue: this.__getOldValue(event.property),
				newValue: this.encodeFunction(event.value)
			});
			
			this.__currentIndex = this.length-1;
			this.dispatchChange('length', 'currentIndex', 'beforeFirst', 'atLast');
		},

		/**
		 * @private
		 */
		__getOldValue: function(property)
		{
			for (var i=this.__currentIndex; i>-1; --i)
			{
				if (this.__history[i].property == property)
				{
					return this.decodeFunction(this.__history[i].newValue);
				}
			}

			return this.__originalValues[property];
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
			if (value === this.__currentIndex || value < -1 || value >= this.length)
			{
				return;
			}
			
			this.__target.removeEventListener(conbo.ConboEvent.CHANGE, this.__changeHandler, this);
	
			var h;
	
			value = Math.max(-1, Math.min(value, this.length-1));
	
			if (value < this.__currentIndex)
			{
				do
				{
					h = this.__history[this.__currentIndex];
					this.__target[h.property] = this.decodeFunction(h.oldValue);
				}
				while (value < --this.__currentIndex)
			}
			else if (value > this.__currentIndex)
			{
				while (true)
				{
					if (!this.beforeFirst)
					{
						h = this.__history[this.__currentIndex];
						this.__target[h.property] = this.decodeFunction(h.newValue);
					}

					if (this.__currentIndex === value)
					{
						break;
					}

					this.__currentIndex++;
				}
			}
			
			this.__target.addEventListener(conbo.ConboEvent.CHANGE, this.__changeHandler, this);
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
			return this.__currentIndex === this.length-1;
		},
	
		/**
		 * Go back 1 step into history
		 * @returns		{conbo.ChangeHistory}
		 */
		back: function()
		{
			--this.currentIndex;
			return this;
		},
	
		/**
		 * Move forward 1 step in history
		 * @returns		{conbo.ChangeHistory}
		 */
		forward: function()
		{
			++this.currentIndex;
			return this;
		},
	
		/**
		 * Move an arbitrary number of steps forward or backward in history
		 * @param		{number} n - The number of steps to move back or forward in history
		 * @returns		{conbo.ChangeHistory}
		 */
		go: function(n)
		{
			this.currentIndex = Math.max(-1, Math.min(this.__currentIndex+n, this.length-1));
			return this;
		},
	
		/**
		 * Encodes values as they're added to history (can be overriden)
		 * @returns		{*}	Value to be added to history
		 */
		encodeFunction: function(value)
		{
			return conbo.clone(value);
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

}));
