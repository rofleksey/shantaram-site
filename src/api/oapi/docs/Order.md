# Order


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**index** | **number** |  | [default to undefined]
**tableID** | **string** |  | [optional] [default to undefined]
**created** | **string** |  | [default to undefined]
**status** | [**OrderStatus**](OrderStatus.md) |  | [default to undefined]
**clientName** | **string** |  | [default to undefined]
**clientComment** | **string** |  | [optional] [default to undefined]
**seen** | **boolean** |  | [default to undefined]
**items** | [**Array&lt;OrderItem&gt;**](OrderItem.md) |  | [default to undefined]

## Example

```typescript
import { Order } from './api';

const instance: Order = {
    id,
    index,
    tableID,
    created,
    status,
    clientName,
    clientComment,
    seen,
    items,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
