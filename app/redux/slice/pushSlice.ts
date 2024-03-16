import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PushSign } from "@/types/pushTypes";
import { Contact } from "@/types/contactTypes";
import { MessageResponse } from "@/types/messageTypes";

interface PushState {
  messages: MessageResponse[];
  pushSign: PushSign;
  recentRequest: Contact[];
  recentContact: Contact[];
  currentContact: Contact;
  newContact: Contact;
}

const initialState: PushState = {
  messages: [],
  pushSign: {},
  recentRequest: [],
  recentContact: [],
  currentContact: {},
  newContact: {},
};

const pushSlice = createSlice({
  name: "push",

  initialState,

  reducers: {
    setPushSign: (state: PushState, action: PayloadAction<PushSign>) => {
      state.pushSign = action.payload;
    },
  },
});

export const { setPushSign } = pushSlice.actions;

export default pushSlice.reducer;
