conbo('example', function()
{
	var ns = this;

	class StateHistoryExample extends conbo.Application
	{
		declarations()
		{
			this.namespace = ns;

			this.name = "Conbo";
			this.a = true;
			this.b = true;
			this.c = true;
			this.d = "x";

			this.history = new StateHistory(this);
		}
	}
	
	ns.import({StateHistoryExample});

});
