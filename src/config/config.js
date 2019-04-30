process.env.PORT = process.env.PORT || 3000;

if(!process.env.URLDB){

process.env.URLDB = 'mongodb://localhost:27017/entrega3';

}

process.env.SENDGRID_API_KEY='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'