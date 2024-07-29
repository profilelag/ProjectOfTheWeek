create table submission
(
    id       integer               not null
        constraint submission_pk
            primary key autoincrement
        constraint submission_pk_2
            unique,
    name     varchar               not null
        constraint submission_pk_3
            unique,
    date     date                  not null,
    approved boolean default false not null
);
