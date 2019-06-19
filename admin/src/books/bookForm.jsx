/*
    Esta página está em construção e algumas coisas são temporárias
    O campo de capa e de links de download do livro será substituído futuramente por campos de upload
*/

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Formik, FieldArray, getIn, Form } from 'formik'
import { createBook, updateBook } from './booksAction'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import * as Yup from 'yup';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
    imagePreview: {
        overflow: "hidden",
    }
}))


function BookForm(props) {
    const classes = useStyles()

    // Validação frontend do formulário
    const BookSchema = Yup.object().shape({
        title: Yup.string()
            .required('O campo título é obrigatório!'),
        author: Yup.string()
            .required('O campo autor é obrigatório!'),
        downloadOptions: Yup.array()
            .of(
                Yup.object().shape({
                    type: Yup.string()
                        .required("O campo tipo é obrigatório!"),
                    file: Yup.string()
                        .required("O campo arquivo é obrigatório!")           
                })
            )
            .ensure()
            .required('É necessário pelo menos uma opção de download!')

    })

    const isNew = props.isNew
    const initialFormValues = { title: '', author: '', description: '', cover: '', downloadOptions: null, buy_links: [''] }

    return (
        <Formik
            initialValues={isNew ? initialFormValues : props.bookData}
            validationSchema={BookSchema}
            enableReinitialize
            onSubmit={(values, actions) => {
                if (!values._id) {
                    props.createBook(values);
                    actions.resetForm(initialFormValues)
                } else {
                    return props.updateBook(values);
                }
            }}
            
            

            render={(formikProps) => {
                const { values, touched, errors, handleChange, handleBlur, setFieldValue } = formikProps;
                console.log(values)
                return (
                    <Form encType="multipart/form-data" autoComplete="off">
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={9}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            autoFocus
                                            variant="outlined"
                                            required
                                            fullWidth
                                            label="Título"
                                            name="title"
                                            value={values.title}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={(errors.title && touched.title) && errors.title}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            label="Autor(es)"
                                            name="author"
                                            value={values.author}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={(errors.author && touched.author) && errors.author}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            multiline
                                            variant="outlined"
                                            fullWidth
                                            label="Descrição"
                                            name="description"
                                            value={values.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={(errors.description && touched.description) && errors.description}
                                        />
                                    </Grid>


                                    <Grid item xs={12}>
                                        <Paper>
                                            <Box p={2}>
                                                <Box mb={2}>
                                                    <Typography variant="h6">
                                                        Opções de Download
                                                    </Typography>
                                                </Box>
                                                
                                                <FieldArray
                                                    name="downloadOptions"
                                                    render={arrayHelpers => (
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12}>
                                                                {values.downloadOptions != null && values.downloadOptions.map((download, index) => (
                                                                    <div key={index}>
                                                                        <Grid container spacing={2}>
                                                                            <Grid item xs={5}>
                                                                                <FormControl fullWidth>
                                                                                    <InputLabel htmlFor="age-simple">Formato</InputLabel>
                                                                                    <Select
                                                                                        value={values.downloadOptions[index].type || ""}
                                                                                        onChange={(event) => { setFieldValue(`downloadOptions.${index}.type`, event.target.value)} }
                                                                                        inputProps={{ name: `downloadOptions.${index}.type` }}
                                                                                    >
                                                                                    <MenuItem value={"pdf"}>PDF</MenuItem>
                                                                                    <MenuItem value={"mobi"}>MOBI</MenuItem>
                                                                                    <MenuItem value={"epub"}>EPUB</MenuItem>
                                                                                    </Select>
                                                                                    <FormHelperText>{(getIn(errors, `downloadOptions.${index}.type`) && getIn(touched, `downloadOptions.${index}.type`)) ? getIn(errors, `downloadOptions.${index}.type`) : ""}</FormHelperText>
                                                                                </FormControl>
                                                                            </Grid>

                                                                            <Grid item xs={5}>
                                                                                <TextField
                                                                                    variant="outlined"
                                                                                    required
                                                                                    fullWidth
                                                                                    label="Link do Download"
                                                                                    name={`downloadOptions.${index}.file`}
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    margin="dense"
                                                                                    value={values.downloadOptions[index].file}
                                                                                    helperText={(getIn(errors, `downloadOptions.${index}.file`) && getIn(touched, `downloadOptions.${index}.file`)) && getIn(errors, `downloadOptions.${index}.file`)}
                                                                                />
                                                                            </Grid>

                                                                            <Grid item xs={2}>
                                                                                <IconButton
                                                                                    onClick={() => arrayHelpers.remove(index)}
                                                                                    color="primary"
                                                                                    aria-label="Remover Opção de Download"
                                                                                >
                                                                                    <RemoveIcon />
                                                                                </IconButton>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </div>
                                                                ))}
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography>

                                                                    <Link href='javascript:;' onClick={() => arrayHelpers.push({ type: 'pdf', file: '' })}>
                                                                        + Adicionar
                                                                    </Link>
                                                                    
                                                                </Typography>
                                                                {typeof errors.downloadOptions === 'string' ? <p>{errors.downloadOptions}</p> : null}
                                                            </Grid>
                                                        </Grid>
                                                    )}
                                                />
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Button variant="contained" color="primary" fullWidth type="submit">
                                            {(isNew) ? "Adicionar" : "Atualizar"}
                                        </Button>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="h6" component="h2">
                                            Capa do Livro
                                        </Typography>

                                        <Box my={2}>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                label="Capa (link da imagem)"
                                                name="cover"
                                                value={values.cover}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={(errors.cover && touched.cover) && errors.cover}
                                            />
                                        </Box>

                                        <div className={classes.imagePreview}>
                                            <img src={values.cover} style={{width:'100%'}} />
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Form>
                )
            }}
        />
    )
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ createBook, updateBook }, dispatch)
export default connect(null, mapDispatchToProps)(BookForm)
