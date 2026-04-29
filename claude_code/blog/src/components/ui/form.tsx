"use client"

import * as React from "react"
import type {
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form"
import { Controller } from "react-hook-form"

import { cn } from "@/lib/utils"

const FormField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>(
  props: ControllerProps<TFieldValues, TName>
) => {
  return <Controller {...props} />
}

export { FormField }
