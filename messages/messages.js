exports.throwErrorMessage = (error) => {
    console.log(
        '**---------------------------------------------------------**'
        + '\nDATE AND TIME: ' +     new Date
        + '\n' +                    error
        + '\n**---------------------------------------------------------**'
    );
};

exports.throwStatusCodeErrorMessage = (error, url) => {
    console.log(
        '**---------------------------------------------------------**'
        + '\nDATE AND TIME: ' +     new Date
        + '\nREQUEST URL: ' +       url
        + '\nSTATUS CODE ERROR: ' + error
        + '\n**---------------------------------------------------------**'
    );
};

exports.throwMissingKeyErrorMessage = (key) => {
    console.log(
        '**---------------------------------------------------------**'
        + '\nDATE AND TIME: ' +     new Date
        + '\nMISSING KEY: ' +       key
        + '\n**---------------------------------------------------------**'
    );
};

exports.throwDataErrorMessage = (error, url) => {
    console.log(
        '**---------------------------------------------------------**'
        + '\nDATE AND TIME: ' +     new Date
        + '\nREQUEST URL: ' +       url
        + '\nDATA: ' + error
        + '\n**---------------------------------------------------------**'
    );
};