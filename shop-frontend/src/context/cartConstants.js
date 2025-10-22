// cartConstants.js
export const initialState = {
  items: [],
  total: 0,
  count: 0
};

export function cartReducer(state, action) {
  console.log('🛒 Cart reducer:', action.type, action.payload);
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        const newState = {
          ...state,
          items: updatedItems,
          total: state.total + action.payload.price,
          count: state.count + 1
        };
        
        console.log('🛒 New state after ADD_ITEM:', newState);
        return newState;
      } else {
        const newItem = { ...action.payload, quantity: 1 };
        const newState = {
          ...state,
          items: [...state.items, newItem],
          total: state.total + action.payload.price,
          count: state.count + 1
        };
        
        console.log('🛒 New state after ADD_ITEM (new item):', newState);
        return newState;
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