"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamoDBTaskSchema = exports.taskSchema = exports.taskInputSchema = exports.repeatWeekdaysSchema = void 0;
var zod_1 = require("zod");
var dateStringSchema = zod_1.z.string().regex(/^\d{4}-\d{1,2}-\d{1,2}$/);
var repeatOptionSchema = zod_1.z.union([
    zod_1.z.literal('No Repeat'),
    zod_1.z.literal('Daily'),
    zod_1.z.literal('Weekdays'),
    zod_1.z.literal('Weekly'),
    zod_1.z.literal('Monthly'),
    zod_1.z.literal('Yearly'),
    zod_1.z.literal('Custom'),
]);
var repeatUnitSchema = zod_1.z.union([
    zod_1.z.literal('day'),
    zod_1.z.literal('week'),
    zod_1.z.literal('month'),
    zod_1.z.literal('year'),
]);
exports.repeatWeekdaysSchema = zod_1.z.tuple([
    zod_1.z.boolean(),
    zod_1.z.boolean(),
    zod_1.z.boolean(),
    zod_1.z.boolean(),
    zod_1.z.boolean(),
    zod_1.z.boolean(),
    zod_1.z.boolean(),
]);
var subTaskSchema = zod_1.z.object({
    title: zod_1.z.string(),
    done: zod_1.z.boolean(),
    snooze: zod_1.z.string().optional(),
});
exports.taskInputSchema = zod_1.z.object({
    title: zod_1.z
        .string({
        required_error: 'Title is required',
    })
        .min(1, {
        message: 'Title is required',
    }),
    dueMonth: zod_1.z.number(),
    dueDay: zod_1.z.number(),
    dueYear: zod_1.z.number(),
    strictDeadline: zod_1.z.boolean(),
    repeat: repeatOptionSchema,
    repeatInterval: zod_1.z.number(),
    repeatWeekdays: exports.repeatWeekdaysSchema,
    repeatUnit: repeatUnitSchema,
    timeFrame: zod_1.z.union([zod_1.z.number(), zod_1.z.string().transform(function (x) { return parseInt(x); })]),
    subtasks: zod_1.z.array(subTaskSchema),
});
exports.taskSchema = zod_1.z.object({
    title: zod_1.z.string(),
    due: zod_1.z.union([dateStringSchema, zod_1.z.literal('No Due Date')]),
    strictDeadline: zod_1.z.boolean(),
    repeat: repeatOptionSchema,
    repeatInterval: zod_1.z.number(),
    repeatUnit: repeatUnitSchema,
    repeatWeekdays: exports.repeatWeekdaysSchema.catch([
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ]),
    timeFrame: zod_1.z.union([zod_1.z.number(), zod_1.z.string().transform(function (x) { return parseInt(x); })]),
    snooze: zod_1.z.string().optional(),
    subtasks: zod_1.z.array(subTaskSchema).catch([]),
});
exports.dynamoDBTaskSchema = zod_1.z.object({
    title: zod_1.z.object({ S: zod_1.z.string() }),
    due: zod_1.z.union([zod_1.z.object({ S: dateStringSchema }), zod_1.z.literal('No Due Date')]),
    strictDeadline: zod_1.z.object({ BOOL: zod_1.z.boolean() }),
    repeat: zod_1.z.object({ S: repeatOptionSchema }),
    repeatInterval: zod_1.z.object({ N: zod_1.z.string().transform(function (x) { return parseInt(x); }) }),
    repeatUnit: zod_1.z.object({ S: repeatUnitSchema }),
    repeatWeekdays: zod_1.z
        .object({
        L: zod_1.z.tuple([
            zod_1.z.object({ BOOL: zod_1.z.boolean() }),
            zod_1.z.object({ BOOL: zod_1.z.boolean() }),
            zod_1.z.object({ BOOL: zod_1.z.boolean() }),
            zod_1.z.object({ BOOL: zod_1.z.boolean() }),
            zod_1.z.object({ BOOL: zod_1.z.boolean() }),
            zod_1.z.object({ BOOL: zod_1.z.boolean() }),
            zod_1.z.object({ BOOL: zod_1.z.boolean() }),
        ]),
    })
        .optional(),
    timeFrame: zod_1.z.union([
        zod_1.z.object({ N: zod_1.z.string().transform(function (x) { return parseInt(x); }) }),
        zod_1.z.object({ S: zod_1.z.string() }).transform(function (x) { return ({ N: parseInt(x.S) }); }),
    ]),
    snooze: zod_1.z.object({ S: zod_1.z.string() }).optional(),
    subtasks: zod_1.z
        .object({
        L: zod_1.z.array(zod_1.z.object({
            M: zod_1.z.object({
                title: zod_1.z.object({ S: zod_1.z.string() }),
                done: zod_1.z.object({ BOOL: zod_1.z.boolean() }),
                snooze: zod_1.z.object({ S: zod_1.z.string() }).optional(),
            }),
        })),
    })
        .optional(),
});
