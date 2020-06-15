class ObserverList{
	constructor(){
		this.observers = [];
	}
	
	notify(trigger){
		for(let i = 0; i < this.observers.length; i++){
			if(this.observers[i].matches(trigger)){
				this.observers[i].invoke();
			}
		}
	}
	
}

class Trigger{
	constructor(invoker, eventName){
		this.invoker = invoker;
		this.triggerName = eventName;
	}
	
	trigger(){
		observerList.notify(this);
	}
}

class Observer{
	constructor(invoker, invocee, triggerName, method){
		this.invoker = invoker;
		this.invocee = invocee;
		this.triggerName = triggerName;
		this.method = method;
		observerList.observers.push(this);
	}
	
	matches(action){
		return this.invoker === action.invoker && this.triggerName === action.triggerName;
	}
	
	invoke(){
		this.method.call(this.invocee);
	}
}