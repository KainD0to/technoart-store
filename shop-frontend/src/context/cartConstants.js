// cartConstants.js
export const initialState = {
  items: [],
  total: 0,
  count: 0
};

export function cartReducer(state, action) {
  console.log('🛒 Reducer called:', { 
    action: action.type, 
    payload: action.payload,
    currentState: state 
  });

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      const itemPrice = Number(action.payload.price) || 0;
      
      console.log('💰 Item price:', { 
        original: action.payload.price, 
        converted: itemPrice 
      });

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        const newTotal = Number(state.total) + itemPrice;
        
        console.log('➕ Updated total:', { old: state.total, new: newTotal });
        
        return {
          ...state,
          items: updatedItems,
          total: newTotal,
          count: state.count + 1
        };
      } else {
        const newItem = { 
          ...action.payload, 
          quantity: 1,
          price: itemPrice
        };
        
        const newTotal = Number(state.total) + itemPrice;
        
        console.log('🆕 New item total:', { old: state.total, new: newTotal });
        
        return {
          ...state,
          items: [...state.items, newItem],
          total: newTotal,
          count: state.count + 1
        };
      }
    }

    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (itemToRemove.price * itemToRemove.quantity),
        count: state.count - itemToRemove.quantity
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const itemToUpdate = state.items.find(item => item.id === id);
      const quantityDiff = quantity - itemToUpdate.quantity;
      
      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      
      return {
        ...state,
        items: updatedItems,
        total: state.total + (itemToUpdate.price * quantityDiff),
        count: state.count + quantityDiff
      };
    }

    case 'CLEAR_CART': {
      return initialState;
    }

    default:
      return state;
  }
}