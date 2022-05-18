import { createAction } from "@reduxjs/toolkit";

export const apiCallStart = createAction("api/CallStart");
export const apiCallSuccess = createAction("api/CallSuccess");
export const apiCallFail = createAction("api/CallFail");
