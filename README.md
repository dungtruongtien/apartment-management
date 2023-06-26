# Apartment Management application

## Development Environment

    node >= 16.14.2
    postgres >= 15.2 (Please create apartment_management before running the app).

## Install

    npm i -g @nestjs/cli
    npm i

## Run the app

    npm run start:dev

    After the service started, please run the SQL Script to seeds Customer and Room data:

    INSERT INTO public.room (room_name,address,description) VALUES
	 ('Room 1','HVT','one bed room'),
	 ('Room 2','LVS','two bed rooms'),
	 ('Room 3','SHW','three bed rooms'),
	 ('Room 4','WIN','one kitchen'),
	 ('Room 5','MDW','two kitchens');


    INSERT INTO public.customer (customer_name) VALUES
      ('Marry'),
      ('Harry'),
      ('Bard'),
      ('Tom');

# Features

The features of Apartment Management app is described below.

`Booking rooms`
- It help customer to books multiple rooms at once time.
- **Feature description**:
    + Using postgres to handle race condition:
        - Each booking info will create a temporarory key to block the booking room.
        - If it can not create any key (duplicate error) => Another request is locking for this room.
            => Reject all booking. Customer will try again later.
        - Release all keys at the end of API flow.
    + Storage all booking info into two tables: Booking and Locking_room:
        + Booking: This table storages everything about booking info, including booking history.
        + Locking_room: This table only storages booking info which is booking is greater than now => All booking validation will use this table for checking.
          => In my opinion, this approach will be increase performance. Because the validation doesn't need to care about the history info, it'll query for the feature only, on the smaller data set.
        + There an cronjob run every 23:00 everyday to delete the booking info which is booking is less than now on Locking_room table.
- **Feature improvements**:
    + Using transactions to handle booking. Need to rollback when any operations failed.
    + Currently, if any customer's booking room is locked (temporary locked by another request or persistent locked by customer) => customer cannot book all the remain rooms. Need to improve to help customer book remain rooms not locked.
    + Improve race condition approach. Currenly, it locked for every room, every customer who is booking the same room will be blocked, even the booking time is not the same. Need to lock room with booking_time to get better approach.
    + Maybe use mem-cache for handle race condition.
    + Authen and author for this feature.
    + Add more filter condition.

`Check available rooms`
- It help customer to check all rooms are available in the specific date range.
- **Feature description**:
    + Build a query base on checking date range.
    + This query will exclusive all rooms which have booking time are overlapping checking date range.
    + Authen and author for this feature.

# REST API

The REST API to the Apartment Management app is described below.

## Booking Rooms

### Request

`POST /booking`

    curl --location 'http://localhost:3000/booking' \
    --header 'Content-Type: application/json' \
    --data '{
        "customerID": 1,
        "bookingInfos": [
            {
                "roomID": 1,
                "checkinDate": "2023-06-28",
                "checkoutDate": "2023-06-30"
            },
            {
                "roomID": 2,
                "checkinDate": "2023-06-28",
                "checkoutDate": "2023-06-30"
            },
            {
                "roomID": 3,
                "checkinDate": "2023-06-28",
                "checkoutDate": "2023-06-30"
            }
        ]
    }'

### Response with success

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 2

### Response with conflict

    HTTP/1.1 409 Conflict
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 409 Conflict
    Connection: close
    Content-Type: application/json
    Content-Length: 2

    {"data":{"room_id":1},"message":"Room is locked for another customer's booking","errorCode":"ROOM_IS_LOCKED_FOR_BOOKING","statusCode":409}

## Check available Rooms

### Request

`POST /booking/check-available`

    curl --location --request GET 'http://localhost:3000/booking/check-available' \
    --header 'Content-Type: application/json' \
    --data '{
        "checkinDate": "2023-07-28",
        "checkoutDate": "2023-09-30",
        "limit": 1,
        "offset": 0
    }'

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 2

    {"data":[{"room_id":1,"room_name":"Room 1","address":"HVT","description":"one bed room"}],"message":"","errorCode":"","statusCode":200}# apartment-management
