create table submission
(
    id       integer               not null
        constraint submission_pk
            primary key autoincrement,
    name     varchar               not null,
    date     date                  not null,
    approved boolean default false not null
);

