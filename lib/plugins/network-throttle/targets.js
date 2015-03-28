module.exports = [
    {
        active:  false,
        title:   "DSL (2Mbps, 5ms RTT)",
        name:    "dsl",
        speed:   200,
        latency: 5,
        urls:    [],
        order:   1
    },
    {
        active:  false,
        title:   "3G (750kbs, 100ms RTT)",
        name:    "3g",
        speed:   75,
        latency: 50,
        urls:    [],
        order:   2

    },
    {
        active:  false,
        name:    "edge",
        title:   "EDGE (250kbs, 300ms RTT)",
        speed:   25,
        latency: 150,
        urls:    [],
        order:   3
    },
    {
        active:  false,
        name:    "gprs",
        title:   "GPRS (50kbs, 500ms RTT)",
        speed:   5,
        latency: 250,
        urls:    [],
        order:   4
    },
    {
        active:  false,
        name:    "none",
        title:   "None",
        speed:   0,
        latency: 0,
        urls:    [],
        order:   5
    }
];