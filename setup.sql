create table user
(
    id   integer not null
        constraint user_pk
            primary key autoincrement
        constraint user_pk_2
            unique,
    name varchar not null
);



create table submission
(
    id       integer               not null
        constraint submission_pk
            primary key autoincrement,
    user     integer               not null,
    name     varchar               not null,
    date     date                  not null,
    approved boolean default false not null
);

